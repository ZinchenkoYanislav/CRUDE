let listPeople = [];

let listCar = [];

let pattern = {
  name: /^[A-Z|А-Я]/g,
  age: /^\d+$/,
  model: /[0-9a-zA-Z_]{2}/g,
  price: /^\d+$/,
};

const savedListPeople = localStorage.getItem("people");
if (savedListPeople) {
  listPeople = JSON.parse(savedListPeople).map((people) =>
    Object.assign(new People(), people)
  );
  // властивість car має бути обєктом Car
  listPeople.map(function (people) {
    return (people.car = Object.assign(new Car(), people.car));
  });
}

const savedListCar = localStorage.getItem("cars");
if (savedListCar) {
  listCar = JSON.parse(savedListCar).map((car) =>
    Object.assign(new Car(), car)
  );
}
