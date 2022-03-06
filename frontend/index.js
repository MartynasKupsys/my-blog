const deleteRecord = () => {
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
};

const editRecord = () => {
  document.querySelectorAll(".edit").forEach((el) => {
    el.addEventListener("click", (event) => {
      // let formMode = document.querySelector("form").getAttribute("data-mode");
      // console.log(formMode);
      const id = el.getAttribute("data-id");
      // if (formMode === "post") {
      //   formMode = document.querySelector("form").setAttribute("data-mode", "edit");
      //   document.querySelector("form").setAttribute("data-id-edit", id);
      // }

      fetch(`http://localhost:5000/record-one/${id}`)
        .then((response) => response.json())
        .then((res) => {
          const data = JSON.parse(res.data);
          console.log(data.image.split("/")[2]);
          console.log(res);
          // if (formMode === "post") {
          document.querySelector("#naujas-irasas").setAttribute("data-mode", "edit");
          document.querySelector("#naujas-irasas").setAttribute("data-id-edit", id);
          // }
          document.querySelector('#naujas-irasas input[name="pavadinimas"]').value =
            data.pavadinimas;
          document.querySelector('#naujas-irasas textarea[name="aprasymas"]').value =
            data.aprasymas;
          document.querySelector('#naujas-irasas input[name="failas"]').filename =
            data.image.split("/")[2];
        });
    });
  });
};

const atvaizdavimas = (duomenys) => {
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
    editRecord();
  } else {
    document.querySelector(".data").textContent = duomenys.message;
  }
};

const writeRecord = () => {
  document.querySelector("#write").addEventListener("click", (event) => {
    event.preventDefault();
    // let data = document.querySelector("#naujas-irasas");
    // let obj = {};
    // new FormData(data).forEach((value, key) => (obj[key] = value));
    // console.log(obj);
    // PVZ ==================================================
    // const name = document.getElementById("name");
    // const files = document.getElementById("files");
    // const formData = new FormData();
    // formData.append("name", name.value);
    //     for(let i =0; i < files.files.length; i++) {
    //         formData.append("files", files.files[i]);
    //=======================================================
    let formMode = document.querySelector("#naujas-irasas").getAttribute("data-mode");
    const id = document.querySelector("#naujas-irasas").getAttribute("data-id-edit");
    console.log(formMode, id);

    let articleForm = document.querySelector("#naujas-irasas");
    let formData = new FormData(articleForm);

    document.querySelector('#naujas-irasas input[name="pavadinimas"]').value = "";
    document.querySelector('#naujas-irasas textarea[name="aprasymas"]').value = "";
    document.querySelector('#naujas-irasas input[name="failas"]').value = null;
    // let pavadinimas = document.querySelector('#naujas-irasas input[name="pavadinimas"]').value;
    // let aprasymas = document.querySelector('#naujas-irasas textarea[name="aprasymas"]').value;
    // console.log(formData.entries());

    if (formMode === "edit") {
      // for (let pair of formData.entries()) {
      //   console.log(pair);
      //   console.log(pair[0] + ", " + pair[1]);
      // }
      console.log("This is 'PUT' Method");
      console.log("Start update record");
      fetch(`http://localhost:5000/irasyti/${id}`, {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res);

          document.querySelector("#naujas-irasas").removeAttribute("data-mode");
          document.querySelector("#naujas-irasas").removeAttribute("data-id-edit");
          return atvaizdavimas(res);
        });
    } else {
      console.log("This is POST Method");
      fetch("http://localhost:5000/irasyti", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => atvaizdavimas(res));
    }
  });
};

// const updateRecord = () => {
//   document.querySelector("#write").addEventListener("click", (event) => {
//     event.preventDefault();
//     // let data = document.querySelector("#naujas-irasas");
//     // let obj = {};
//     // new FormData(data).forEach((value, key) => (obj[key] = value));
//     // console.log(obj);
//     let formMode = document.querySelector("form").getAttribute("data-mode");
//     const id = document.querySelector("form").getAttribute("data-id-edit");
//     console.log(formMode, id);

//     let articleForm = document.querySelector("#naujas-irasas");
//     let formData = new FormData(articleForm);

//     // document.querySelector('#naujas-irasas input[name="pavadinimas"]').value = "";
//     // document.querySelector('#naujas-irasas textarea[name="aprasymas"]').value = "";
//     // document.querySelector('#naujas-irasas input[name="failas"]').value = null;

//     // console.log(formData.entries());
//     for (let pair of formData.entries()) {
//       console.log(pair[0] + ", " + pair[1]);
//     }
//     if (formMode === "edit") {

//     }
//   });
// };

writeRecord();
// updateRecord();

const pagrindinisAtvaizdavimas = () => {
  fetch("http://localhost:5000")
    .then((response) => response.json())
    .then((res) => {
      // console.log(res);
      atvaizdavimas(res);
    });
};

pagrindinisAtvaizdavimas();

/***********************************************************************************************************
 *  Originalus irasymas
 * 
 * const writeRecord = () => {
  document.querySelector("#write").addEventListener("click", (event) => {
    event.preventDefault();
    // let data = document.querySelector("#naujas-irasas");
    // let obj = {};
    // new FormData(data).forEach((value, key) => (obj[key] = value));
    // console.log(obj);
    let formMode = document.querySelector("form").getAttribute("data-mode");
    const id = document.querySelector("form").getAttribute("data-id-edit");
    console.log(formMode, id);

    let articleForm = document.querySelector("#naujas-irasas");
    let formData = new FormData(articleForm);
    console.log(formData.entries());

    if (formMode === "edit") {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      console.log("Start update record");
      fetch(`http://localhost:5000/atnaujinti`, {
        method: "POST",
        body: { formData, idEdit: id },
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          formMode = document.querySelector("form").setAttribute("data-mode", "post");
          document.querySelector("form").removeAttribute("data-id-edit");
        });
    } else {
      console.log(formMode);
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
    }
    document.querySelector('#naujas-irasas input[name="pavadinimas"]').value = "";
    document.querySelector('#naujas-irasas textarea[name="aprasymas"]').value = "";
    document.querySelector('#naujas-irasas input[name="failas"]').value = null;
  });
};
 ***************************************************************************************/
