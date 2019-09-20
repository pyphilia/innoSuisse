/**
 * Read a workflow build within the main interface area
 * and translates it into a xml file
 */
import xml2js from "xml2js";
import { webservices } from "../constants/globals";

export const saveWorkflow = jsonGraph => {
  const allPorts = {};

  const Steps = { Step: [] };
  // NODE
  jsonGraph.cells
    .filter(cell => cell.type != "standard.Link")
    .forEach((box, i) => {
      const { id: Id, type, defaultParams, ports } = box;
      const Name = type.replace(/\s/g, "");
      const No = i;
      const Inputs = { Parameter: [], Data: [] };
      for (const [Name, values] of Object.entries(defaultParams)) {
        const { value: Value, defaultValue } = values;
        if (Value != defaultValue.toString()) {
          Inputs.Parameter.push({
            Name,
            Value
          });
        }
      }

      ports.items.forEach(port => {
        allPorts[port.id] = {
          boxId: Id,
          boxNo: i,
          name: port.name
        };
      });

      // key in webservices list
      const Key = webservices.filter(algo => algo.name == type)[0].id;
      const Service = { Key };

      const step = { Id, No, Name, Service, Inputs };
      Steps.Step.push(step);
    });

  // LINK
  jsonGraph.cells
    .filter(cell => cell.type == "standard.Link")
    .forEach(link => {
      const {
        source: { port: sourcePort },
        target: { port: targetPort }
      } = link;
      const targetBox = allPorts[targetPort];
      const targetWebservice = Steps.Step.filter(
        step => step.Id == targetBox.boxId
      )[0];

      const { boxId: Ref, name: ServiceOutputName } = allPorts[sourcePort];
      const p = {
        Name: targetBox.name,
        Value: {
          WorkflowStep: {
            Ref,
            ServiceOutputName
          }
        }
      };
      targetWebservice.Inputs.Data.push(p);
    });

  const Id = 1; // workflow id
  const Information = "";
  const result = { Id, Information, Steps };

  const builder = new xml2js.Builder({ rootName: "WorkflowDefinition" });
  const xml = builder.buildObject(result);

  //@TODO add xml headers
  // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
  // saveAs(blob, "../../tmp/hello.xml");

  console.log(xml);
};