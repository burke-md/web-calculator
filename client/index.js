const createQueryString = (inputArray) => {
  const leftOp = document.getElementById("leftOp").value;
  const rightOp = document.getElementById("rightOp").value;
  const radioAddition = document.getElementById("radioAddition").checked;
  const radioSubtraction = document.getElementById("radioSubtraction").checked;
  const radioMultiplication = document.getElementById(
    "radioMultiplication"
  ).checked;
  const radioDivision = document.getElementById("radioDivision").checked;
  const radioRemainder = document.getElementById("radioRemainder").checke;

  let queryStr = `http://localhost:8080/leftOperand=${leftOp}&rightOperand=${rightOp}&operation=`;

  //Create error checking function to ensure multiple operators have not been selectes.
  //Ensure left and right Operands are of correct type (Number).

  if (radioAddition) {
    queryStr += `+`;
  }else if (radioSubtraction) {
    queryStr += `-`;
  }else if (radioMultiplication) {
    queryStr += `*`;
  }else if (radioDivision) {
    queryStr += `/`;
  }else if (radioRemainder) {
    queryStr += `%`;
  }

  return queryStr;
};

const makeRequest =(query) => {
  const httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    console.log(' Cannot create an XMLHTTP instance');
    return false;
  }

  httpRequest.onreadystatechange = handleResponse;
  httpRequest.open('GET', query);
  httpRequest.send();

  function handleResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        alert(httpRequest.responseText);
        //This should show JSON formatted response.
        //Update expressiona and result
        
      } else {
        console.log('There was a problem with the request.');
      }
    }
  }

}



const makeCalculation = () => {
  const queryString = createQueryString();

  console.log(`query string:\n${queryString}`)

  makeRequest(queryString);
};
