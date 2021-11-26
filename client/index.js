const makeCalculation = () => {
  const validInput = validateOperands() && operatorSelected();
  if (validInput) {
    const queryString = createQueryString();
    makeRequest(queryString);
  }
  clearInputs();
};

//Helper functions below.

const createQueryString = () => {
  const leftOp = document.getElementById("leftOp").value;
  const rightOp = document.getElementById("rightOp").value;
  const radioAddition = document.getElementById("radioAddition").checked;
  const radioSubtraction = document.getElementById("radioSubtraction").checked;
  const radioMultiplication = document.getElementById(
    "radioMultiplication"
  ).checked;
  const radioDivision = document.getElementById("radioDivision").checked;
  const radioRemainder = document.getElementById("radioRemainder").checked;

  let queryStr = `http://localhost:8080/leftOperand=${leftOp}&rightOperand=${rightOp}&operation=`;

  if (radioAddition) {
    queryStr += `+`;
  } else if (radioSubtraction) {
    queryStr += `-`;
  } else if (radioMultiplication) {
    queryStr += `*`;
  } else if (radioDivision) {
    queryStr += `/`;
  } else if (radioRemainder) {
    queryStr += `%`;
  }

  return queryStr;
};

const makeRequest = (queryString) => {
  const httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    console.log(" Cannot create an XMLHTTP instance");
    return false;
  }
  httpRequest.onreadystatechange = handleResponse;
  httpRequest.open("GET", queryString);
  httpRequest.send();
  function handleResponse() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        const objResponse = JSON.parse(httpRequest.responseText);
        displayResults(objResponse);
      } else {
        console.log("There was a problem with the request.");
      }
    }
  }
};

const displayResults = (resObj) => {
  document.getElementById("calculation-expression").innerText =
    resObj.Expression;
  document.getElementById("calculation-result").innerText = resObj.Result;
};

const clearInputs = () => {
  document.getElementById("radioAddition").checked = false;
  document.getElementById("radioSubtraction").checked = false;
  document.getElementById("radioMultiplication").checked = false;
  document.getElementById("radioDivision").checked = false;
  document.getElementById("radioRemainder").checked = false;
  document.getElementById("leftOp").value = "";
  document.getElementById("rightOp").value = "";
};

const validateOperands = () => {
  const leftOp = document.getElementById("leftOp").value;
  const rightOp = document.getElementById("rightOp").value;
  const acceptedChars = /^[0-9.]+$/;
  
  if (leftOp.match(acceptedChars) && rightOp.match(acceptedChars)) {
    return true;
  }

  alert(`Invalid input.`);
  return false;
};

const operatorSelected = () => {
  const radioAddition = document.getElementById("radioAddition").checked;
  const radioSubtraction = document.getElementById("radioSubtraction").checked;
  const radioMultiplication = document.getElementById(
    "radioMultiplication"
  ).checked;
  const radioDivision = document.getElementById("radioDivision").checked;
  const radioRemainder = document.getElementById("radioRemainder").checked;

  const operatorList = [
    radioAddition,
    radioSubtraction,
    radioMultiplication,
    radioDivision,
    radioRemainder,
  ];

  let opSelected = false;

  operatorList.forEach((operator) => {
    if (operator) opSelected = true;
  });

  if (opSelected) {
    return true;
  } else {
    alert(`No operator has been selected.`);
    return false;
  }
};
