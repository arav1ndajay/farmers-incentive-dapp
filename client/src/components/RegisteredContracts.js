import Policy_1 from "../contracts/Policy_1.json"; 
import Policy_2 from "../contracts/Policy_2.json"; 
// FLAG END OF IMPORTS (Do not uncomment)
let RegisteredContracts = [];
const networkId = "5777";


RegisteredContracts.push([Policy_1.abi,Policy_1.networks[networkId]]); 
RegisteredContracts.push([Policy_2.abi,Policy_2.networks[networkId]]); 

// FLAG END OF REGISTERS (Do not uncomment)
export default RegisteredContracts;