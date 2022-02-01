function displayListPeople() {
  wrapper.innerHTML = "";
  let people = `<div class="people">
        ${getListPeople()}
    </div>
    <button type="button" class="btn btn-warning btn-add-people mt-3">Add people</button>`;
  wrapper.insertAdjacentHTML("afterbegin", people);
  toggleFormAddPeople();
  editPeople();
}

function displayListCar() {
  wrapper.innerHTML = "";
  let cars = `<div class="cars">
        ${getListCar()}
    </div>
    <button type="button" class="btn btn-warning btn-add-car mt-3">Add car</button>`;
  wrapper.insertAdjacentHTML("afterbegin", cars);
  toggleFormAddCar();
  editCar();
}

function getListPeople() {
  let list = `<ul class="list-group mt-3">`;
  listPeople.forEach((people) => {
    if (!people.car) {
      people.car = new Car("-", "-", "-");
    }
    list += `<li class="list-group-item" data-id="${people.id}">
            <p>Name: ${people.name}</p>
            <p>Age: ${people.age}</p>
            <p>Car: ${people.car.model}</p>
            <p class="">
                <button type="button" class="btn btn btn-secondary btn-edit-people">Edit</button>
                <button type="button" class="btn btn btn-danger btn-delete-people">Delete</button>
            </p>
        </li>`;
  });
  list += "</ul>";
  return list;
}

function getFormPeople(
  mode = "add",
  id = "add",
  name = "",
  age = "",
  car = "",
  btnMode = "btn-add",
  btnValue = "Add"
) {
  let form = `<form class="form-${mode}-people mt-3" data-id="${id}">
        <div class="mb-3">
            Name
            <input value="${name}" type="text" name="name" class="form-control" placeholder="Name">
            <small class="text-danger hidden errorName">Start with big letter</small>
        </div>
        <div class="mb-3">
            Age
            <input value="${age}" type="text" name="age" class="form-control" placeholder="Age">
            <small class="text-danger hidden errorAge">Shold be number</small>
        </div>
        <div class="mb-3">
            <select value="${car}" class="form-select" name="car">
                Car
                <option selected>-</option>
                ${getOptionsCar()}
            </select>
        </div>
        <button type="submit" class="btn btn-info ${btnMode}">${btnValue}</button>
    </form>`;
  return form;
}

function getOptionsCar() {
  let options = "";
  listCar.forEach((car) => {
    options += `<option value="${car.id}">${car.model}</option>`;
  });
  return options;
}

function toggleFormAddPeople() {
  document
    .querySelector(".btn-add-people")
    .addEventListener("click", function () {
      checkingNumberForm();
      wrapper.insertAdjacentHTML("beforeend", getFormPeople());
      document
        .querySelector(".form-add-people")
        .addEventListener("submit", handlerFormAddPeople);
    });
}

function checkingNumberForm() {
  let form = document.querySelector("form");
  if (form) {
    form.remove();
  }
}

function handlerFormAddPeople(e) {
  e.preventDefault();
  if (
    validatePeopleName(this.elements.name) &&
    validatePeopleAge(this.elements.age)
  ) {
    let itemPeople = new People(
      generateId(listPeople),
      this.elements.name.value,
      this.elements.age.value
    );
    let idCar = +this.elements.car.value;
    let selectCar = listCar.find((car) => car.id === idCar);
    itemPeople.setCar(selectCar);

    listPeople.push(itemPeople);

    this.remove();
    document.querySelector(".people").innerHTML = getListPeople();
    updateStorage();
  }
}

function generateId(list) {
  let id = 0;
  if (list.length > 0) {
    id = list[list.length - 1].id + 1;
  }
  return id;
}

function editPeople() {
  document.querySelector(".people").addEventListener("click", function (e) {
    let target = e.target;
    //edit
    if (target.classList.contains("btn-edit-people")) {
      checkingNumberForm();
      const id = +target.closest("li").getAttribute("data-id");
      const human = listPeople.find((human) => human.id === id);
      if (human) {
        e.target
          .closest("li")
          .insertAdjacentHTML(
            "afterend",
            getFormPeople(
              "edit",
              human.id,
              human.name,
              human.age,
              human.car.id,
              "btn-edit",
              "Edit"
            )
          );
        let select = document.querySelector("select");
        select.value = human.car.id;
      }
    }
    if (target.classList.contains("btn-edit")) {
      let editForm = document.querySelector(".form-edit-people");
      editForm.addEventListener("submit", EditFormForHuman);
    }
    //delete
    if (target.classList.contains("btn-delete-people")) {
      let conf = confirm("Do you want delete this human?");
      if (conf) {
        const id = +target.closest("li").getAttribute("data-id");
        const human = listPeople.findIndex((human) => human.id === id);
        console.log(human);
        listPeople.splice(human, 1);

        displayListPeople();
        updateStorage();
      }
    }
  });
}

function EditFormForHuman(e) {
  e.preventDefault();
  if (
    validatePeopleName(this.elements.name) &&
    validatePeopleAge(this.elements.age)
  ) {
    const id = +this.dataset.id;
    const name = this.elements.name.value;
    const age = this.elements.age.value;
    const idCar = this.elements.car.value;
    let selectCar = {};
    if (idCar === "-") {
      selectCar = new Car("-", "-", "-");
    } else {
      selectCar = listCar.find((car) => car.id === +idCar);
    }

    const editHuman = new People(id, name, age);
    editHuman.setCar(selectCar);

    const indexPeople = listPeople.findIndex((human) => human.id === id);
    listPeople.splice(indexPeople, 1, editHuman);
    wrapper.innerHTML = "";

    updateStorage();
    displayListPeople();
  }
}
//validate People
function validatePeopleName(name) {
  let validate = false;
  let errorName = document.querySelector(".errorName");
  if (!name.value.match(pattern.name)) {
    errorName.classList.remove("hidden");
    validate = false;
  } else {
    errorName.classList.add("hidden");
    validate = true;
  }
  return validate;
}

function validatePeopleAge(age) {
  let validate = false;
  let errorAge = document.querySelector(".errorAge");
  if (!age.value.match(pattern.age)) {
    errorAge.classList.remove("hidden");
    validate = false;
  } else {
    errorAge.classList.add("hidden");
    validate = true;
  }
  return validate;
}

function getListCar() {
  let list = `<ul class="list-group mt-3">`;
  listCar.forEach((car) => {
    list += `<li class="list-group-item" data-id="${car.id}">
          <p>Model: ${car.model}</p>
          <p>Price: ${car.price}$</p>
          <p class="">
              <button type="button" class="btn btn btn-secondary btn-edit-car">Edit</button>
              <button type="button" class="btn btn btn-danger btn-delete-car">Delete</button>
          </p>
      </li>`;
  });
  list += "</ul>";
  return list;
}

function toggleFormAddCar() {
  document.querySelector(".btn-add-car").addEventListener("click", function () {
    checkingNumberForm();
    wrapper.insertAdjacentHTML("beforeend", getFormCar());
    document
      .querySelector(".form-add-car")
      .addEventListener("submit", handlerFormAddCar);
  });
}

function handlerFormAddCar(e) {
  e.preventDefault();
  if (
    validateCarModel(this.elements.model) &&
    validatePriceCar(this.elements.price)
  ) {
    let itemCar = new Car(
      generateId(listCar),
      this.elements.model.value,
      this.elements.price.value
    );

    listCar.push(itemCar);
    console.log(listCar);
    this.remove();
    document.querySelector(".cars").innerHTML = getListCar();
    updateStorage();
  }
}

function getFormCar(
  mode = "add",
  id = "add",
  model = "",
  price = "",
  btnValue = "Add"
) {
  let form = `<form class="form-${mode}-car mt-3" data-id="${id}">
            <div class="mb-3">
                Model
                <input value='${model}' type="text" name="model" class="form-control" placeholder="Model">
                <small class="text-danger hidden errorCarModel">should be more than 2 symbols</small>
            </div>
            <div class="mb-3">
                Price
                <input value='${price}' type="text" name="price" class="form-control" placeholder="Price">
                <small class="text-danger hidden errorCarPrice">Shold be number</small>
            </div>
            <button type="submit" class="btn btn-info btn-edit-car-confirm">${btnValue}</button>
        </form>`;
  return form;
}

function editCar() {
  document.querySelector(".cars").addEventListener("click", function (e) {
    let target = e.target;
    //edit
    if (target.classList.contains("btn-edit-car")) {
      checkingNumberForm();
      const id = +target.closest("li").getAttribute("data-id");
      const car = listCar.find((car) => car.id === id);
      if (car) {
        e.target
          .closest("li")
          .insertAdjacentHTML(
            "afterend",
            getFormCar("edit", car.id, car.model, car.price, "Edit")
          );
      }
    }
    if (target.classList.contains("btn-edit-car-confirm")) {
      let editForm = document.querySelector(".form-edit-car");
      editForm.addEventListener("submit", EditFormForCar);
    }
    //delete
    if (target.classList.contains("btn-delete-car")) {
      let conf = confirm("Do you want delete this car?");
      if (conf) {
        const id = +target.closest("li").getAttribute("data-id");
        const car = listCar.findIndex((car) => car.id === id);
        // delete also in people
        const objCar = listCar.find((car) => car.id === id);
        console.log(objCar.model);
        listPeople.map(function (people) {
          if (people.car.model === objCar.model) {
            return (people.car = new Car("-", "-", "-"));
          } else return people.car;
        });
        listCar.splice(car, 1);

        displayListCar();
        updateStorage();
      }
    }
  });
}

function EditFormForCar(e) {
  e.preventDefault();
  if (
    validateCarModel(this.elements.model) &&
    validatePriceCar(this.elements.price)
  ) {
    const id = +this.dataset.id;
    const model = this.elements.model.value;
    const price = this.elements.price.value;

    const editCar = new Car(id, model, price);

    const indexCar = listCar.findIndex((car) => car.id === id);
    listCar.splice(indexCar, 1, editCar);
    wrapper.innerHTML = "";

    updateStorage();
    displayListCar();
  }
}

function validateCarModel(model) {
  let validate = false;
  let errorCarModel = document.querySelector(".errorCarModel");
  if (!model.value.match(pattern.model)) {
    errorCarModel.classList.remove("hidden");
    validate = false;
  } else {
    errorCarModel.classList.add("hidden");
    validate = true;
  }
  return validate;
}

function validatePriceCar(price) {
  let validate = false;
  let errorPrice = document.querySelector(".errorCarPrice");
  if (!price.value.match(pattern.price)) {
    errorPrice.classList.remove("hidden");
    validate = false;
  } else {
    errorPrice.classList.add("hidden");
    validate = true;
  }
  return validate;
}

function updateStorage() {
  localStorage.setItem("people", JSON.stringify(listPeople));
  localStorage.setItem("cars", JSON.stringify(listCar));
}

// 1. Редагування людей
// 2. Видалення з підтвердженням
// 3. Переключення вкладок люди-авто
// 4. Для авто все аналогічно як для людей, без присвоєння авто
