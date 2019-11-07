/**
 * Read a workflow from a xml file and open it
 * in the main interface area
 */
import xml2js from "xml2js";
import { getWebserviceById } from "../constants/globals";
import {
  buildElementFromName,
  buildDefaultParameters
} from "../elements/addElement";
import { app } from "../app";
import { isParamInput, generateUniqueId } from "../layout/utils";
import { openWorkflowFromId } from "../api/requests";

export const readWorkflow = async id => {
  const xml = await openWorkflowFromId(id);

  const elements = [];
  const links = [];

  xml2js.parseString(xml, async (err, json) => {
    if (!json.WorkflowDefinition.Steps) {
      return;
    }

    const { Step = [] } = json.WorkflowDefinition.Steps[0];

    for (const step of Step) {
      const {
        Id: [id], // from saveWorkflow, id  is defined with the boxId
        Inputs: [inputs],
        Name: [name],
        Service: [service]
      } = step;

      const webserviceObj = getWebserviceById(service.Key[0]);
      if (webserviceObj.length) {
        alert("step ", name, " not found");
      }
      //@TODO check defaultParams match with definition
      const { Parameter, Data } = inputs;
      const defaultParams = buildDefaultParameters(
        webserviceObj.inputs.filter(inp => isParamInput(inp))
      );

      if (Parameter) {
        for (const param of Parameter) {
          const {
            paramName: [name],
            Value: [value]
          } = param;

          const type = webserviceObj.inputs.find(input => input.name == name)
            .type;

          defaultParams[type][name].value = value;
        }
      }

      // store links
      if (Data) {
        for (const port of Data) {
          const {
            Value: [value],
            Name: [portName]
          } = port;
          const {
            Ref: [ref],
            ServiceOutputName: [serviceName]
          } = value.WorkflowStep[0];

          const source = {
            boxId: ref,
            portName: serviceName
          };
          const target = { boxId: id, portName };
          links.push({
            id: generateUniqueId(),
            source,
            target
          });
        }
      }

      const information = { id };

      // add element
      const param = buildElementFromName(webserviceObj.name);

      const element = {
        ...param,
        information,
        defaultParams,
        boxId: id
      };

      elements.push(element);
    }
  });

  app.openWorkflow({ elements, links });
};
