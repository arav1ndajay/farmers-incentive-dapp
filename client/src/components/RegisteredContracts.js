import Policy_1 from "../contracts/Policy_1.json";
import Policy_2 from "../contracts/Policy_2.json";

let RegisteredContracts = [];
const networkId = "1617855794786";

RegisteredContracts.push([Policy_1.abi,Policy_1.networks[networkId]]);
RegisteredContracts.push([Policy_2.abi,Policy_2.networks[networkId]]);

export default RegisteredContracts;
