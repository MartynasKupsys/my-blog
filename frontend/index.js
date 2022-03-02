function getData() {
  fetch("http://localhost:5000")
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      document.querySelector(".data").textContent = response.message;
    });
}

getData();
