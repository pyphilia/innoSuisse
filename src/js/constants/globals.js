import { Decorators } from "divaservices-utils";
import { getServicesAPI } from "../api/requests";

export let webservices;
export let dataInputs;

const _initWebservices = async () => {
  const xml = await getServicesAPI();
  webservices = await Decorators.webservicesDecorator(xml);
};

// const _initDataInputs = async () => {
//   const inputDataFilePath = INPUTS_DATA_XML_FILEPATH;
//   const inputDataXml = (await import(`!!raw-loader!../../${inputDataFilePath}`))
//     .default;
//   const dataTest = await createXml2jsPromise(inputDataXml);
//   dataInputs = dataTestDecorator(dataTest);
// };

// init webservices from xml file
export const initWebservices = async () => {
  await _initWebservices();
  // await _initDataInputs();
};

export const getWebserviceByName = name => {
  const webservice = webservices.find(service => service.name == name);
  if (!webservice) {
    throw "Cannot find webservice with name " + name;
  }
  return webservice;
};

export const getWebserviceById = id => {
  const webservice = webservices.find(webservice => webservice.id == id);
  if (!webservice) {
    throw "Cannot find webservice with id " + id;
  }
  return webservice;
};

export const getDataInputByName = name => {
  const dataInput = dataInputs.find(inp => inp.name == name);
  if (!dataInput) {
    throw "Cannot find dataInput with name " + name;
  }
  return dataInput;
};
