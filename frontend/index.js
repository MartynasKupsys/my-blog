function deleteRecord() {
  document.querySelectorAll(".delete").forEach((el) => {
    el.addEventListener("click", (event) => {
      const id = el.getAttribute("data-id");
      fetch(`http://localhost:5000/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((res) => {
          atvaizdavimas(res);
        });
      // console.log(id);
    });
  });
}

function atvaizdavimas(duomenys) {
  console.log(duomenys);
  if (duomenys.response) {
    let html = document.querySelector(".data");
    const irasai = JSON.parse(duomenys.data);
    console.log(irasai);
    const atvaizdavimas = irasai.reduce((pre, cur) => {
      pre += `<div class='col-4 d-flex flex-column align-items-center mb-1 border'> 
        <div><img src=http://localhost:5000${cur.image} /></div>
        <div>${cur.pavadinimas}</div>
        <div>${cur.data}</div>
        <div class='aprasymas'>${cur.aprasymas}</div>
        <div>
          <button data-id="${cur.id}" class="delete">Delete</button>
          <button data-id="${cur.id}" class="edit">Edit</button>
        </div>
        
      </div>`;
      return pre;
    }, "");
    html.innerHTML = atvaizdavimas;
    deleteRecord();
  } else {
    document.querySelector(".data").textContent = duomenys.message;
  }
}

function writeRecord() {
  document.querySelector("#write").addEventListener("click", (event) => {
    event.preventDefault();
    // let data = document.querySelector("#naujas-irasas");
    // let obj = {};
    // new FormData(data).forEach((value, key) => (obj[key] = value));
    // console.log(obj);
    let articleForm = document.querySelector("#naujas-irasas");
    let formData = new FormData(articleForm);
    console.log(formData);
    document.querySelector('#naujas-irasas input[name="pavadinimas"]').value = "";
    document.querySelector('#naujas-irasas textarea[name="aprasymas"]').value = "";
    document.querySelector('#naujas-irasas input[name="failas"]').value = null;

    fetch("http://localhost:5000/irasyti", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      // headers: {
      //   Accept: "application/json, application/xml, text/plain, text/html, *.*",
      //   "Content-Type": "multipart/form-data",
      // },
      // body: JSON.stringify(obj),
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => atvaizdavimas(res));
  });
}
writeRecord();

function pagrindinisAtvaizdavimas() {
  fetch("http://localhost:5000")
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      atvaizdavimas(res);
    });
}

pagrindinisAtvaizdavimas();
