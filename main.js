const array = []
const staff = [
  {
    id: 1,
    name: "Alex Rosetta",
    email: "alexyrosetta@egmail.com",
    image: "staff-1.jpg",
  },
  {
    id: 2,
    name: "Maria July",
    email: "mariajuly@egmail.com",
    image: "staff-2.jpg",
  },
];
const availableDates = ["2023-07-13", "2023-07-14", "2023-07-15"];
const services = [
  {
    id: 1,
    name: "Oral hygiene",
    image: "services-1.jpg",
    duration: "1 hour",
    price: 50.0,
  },
  {
    id: 2,
    name: "Implants",
    image: "services-2.jpg",
    duration: "1 hour 30 minutes",
    price: 120.0,
  },
];
const times = [
  {
    start_time: "09:00",
    end_time: "09:30",
  },
  {
    start_time: "09:30",
    end_time: "10:00",
  },
];

class StuffPage {
  state = {
    stuffId: null,
  };

  constructor() { }

  get HTML() {
    return `
      <div class="page-name">Staff Page</div>
      <ul class="card-list">
        ${staff
        .map((item) => {
          return `
              <li class="flex-row card staff-card" data-stuff-id="${item.id}">
                <img src="img/${item.image}">
                <div class="flex-column">
                  <p>${item.name}</p>
                  <p class="email">${item.email}</p>
                </div>
              </li>`;
        })
        .join("")}
      </ul>
    `;
  }

  clearSelection() {
    document.querySelectorAll(`*[data-stuff-id]`).forEach((el) => {
      el.classList.remove("selected");
    });
  }

  onStuffSelect(id) {
    this.clearSelection();
    this.state.stuffId = id;
    const selectedCard = document.querySelector(`*[data-stuff-id="${id}"]`);
    if (selectedCard) {
      selectedCard.classList.add("selected");
    }
  }

  afterRender() {
    const self = this;
    document.querySelectorAll(`*[data-stuff-id]`).forEach((el) => {
      el.addEventListener("click", () => {
        self.onStuffSelect(parseFloat(el.getAttribute("data-stuff-id")));
      });
    });
  }

  onSubmit() {
    if (!this.state.stuffId) {
      return "Select a staff";
    }
  }
}
class ServicePage {
  state = {
    serviceId: null,
  };
  constructor() { }
  get HTML() {
    return `
    <div class="page-name">Service Page</div>
      <ul class="card-list">
        ${services
        .map((item) => {
          return `
            <li class="flex flex-row card" data-service-id="${item.id}">
              <img src="img/${item.image}">
              <div class="flex-column">
                <p>${item.name}</p>
                <p>${item.duration}</p>
              </div>
              <p>${item.price}$</p>
            </li>`;
        })
        .join("")}
      </ul>
    `;
  }
  onServiceSelect(id) {
    this.state.serviceId = id;
  }
  afterRender() {
    document.querySelectorAll(`*[data-service-id]`).forEach((el) => {
      el.addEventListener("click", () => {
        this.onServiceSelect(parseFloat(el.getAttribute("data-service-id")));
      });
    });
  }
  onSubmit() {
    if (!this.state.serviceId) {
      return "Select service";
    }
  }
}
class SingleDay {
  constructor({ index, day, month, year, week = null }) {
    this.day = day;
    this.index = index;
    this.month = month;
    this.year = year;
    this.week = week;
  }
  get date() {
    return new Date(this.year, this.month, this.day);
  }
  get disabled() {
    const available = availableDates.find((a) => {
      a = new Date(a);
      a = {
        day: a.getDate(),
        month: a.getMonth() + 1,
        year: a.getFullYear(),
      };
      return (
        this.year === a.year && this.month === a.month && this.day === a.day
      );
    });
    return !available;
  }
  get weekDay() {
    return this.date.getDay() + 1;
  }
}
class DatePicker {
  state = {
    month: new Date().getMonth() + 1,
    day: null,
    year: new Date().getFullYear(),
    selectedDay: null,
  };
  timePicker = null;
  constructor({ datePickerEl, timePickerEl, availableDates }) {
    this.element = datePickerEl;
    this.timePicker = new TimePicker(timePickerEl);
    this.render();
  }
  render() {
    this.element.innerHTML = this.HTML;
    this.afterRender();
  }
  get monthDate() {
    return new Date(this.state.year, this.state.month, 0);
  }
  get daysCount() {
    return this.monthDate.getDate();
  }
  get monthName() {
    return this.monthDate.toLocaleString("en-us", { month: "long" });
  }

  get days() {
    let weeks = {
      1: [],
    };
    let currentWeek = 1;

    for (let index = 0; index < this.daysCount; index++) {
      const day = new SingleDay({
        index,
        day: index + 1,
        month: this.state.month - 1,
        year: this.state.year,
      });
      const weekDay = day.weekDay;
      if (weekDay % 7 === 0) {
        day.week = currentWeek;
        currentWeek += 1;
      } else {
        day.week = currentWeek;
      }

      if (!weeks[day.week]) weeks[day.week] = [];
      weeks[day.week].push(day);
    }
    return weeks;
  }

  get HTML() {
    const weeks = this.days;
    return `
    <div class="flex flex-row items-center">
    <button data-back-month><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 7L9 12L14 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></button> <p>${this.monthName} ${this.state.year
      }</p><button data-next-month><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M10 17L15 12L10 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg></button>
    </div>
        <table>
    <tr>
    <th>Sun</th>
    <th>Mon</th>
    <th>Tue</th>
    <th>Wed</th>
    <th>Thu</th>
    <th>Fri</th>
    <th>Sat</th>
    </tr>
    ${Object.values(weeks)
        .map((days) => {
          const mon = days.find((a) => a.weekDay == 1);
          const tue = days.find((a) => a.weekDay == 2);
          const wed = days.find((a) => a.weekDay == 3);
          const thu = days.find((a) => a.weekDay == 4);
          const fri = days.find((a) => a.weekDay == 5);
          const sat = days.find((a) => a.weekDay == 6);
          const sun = days.find((a) => a.weekDay == 7);
          return `
        <tr>
      <td><button ${mon?.disabled ? "disabled" : ""} class="date-day ${mon?.day === this.state.day ? "active" : ""
            }" data-day="${mon?.day}">${mon?.day || ""}</button></td>
      <td><button ${tue?.disabled ? "disabled" : ""} class="date-day ${tue?.day === this.state.day ? "active" : ""
            }" data-day="${tue?.day}">${tue?.day || ""}</button></td>
      <td><button ${wed?.disabled ? "disabled" : ""} class="date-day ${wed?.day === this.state.day ? "active" : ""
            }" data-day="${wed?.day}">${wed?.day || ""}</button></td>
      <td><button ${thu?.disabled ? "disabled" : ""} class="date-day ${thu?.day === this.state.day ? "active" : ""
            }" data-day="${thu?.day}">${thu?.day || ""}</button></td>
      <td><button ${fri?.disabled ? "disabled" : ""} class="date-day ${fri?.day === this.state.day ? "active" : ""
            }" data-day="${fri?.day}">${fri?.day || ""}</button></td>
      <td><button ${sat?.disabled ? "disabled" : ""} class="date-day ${sat?.day === this.state.day ? "active" : ""
            }" data-day="${sat?.day}">${sat?.day || ""}</button></td>
      <td><button ${sun?.disabled ? "disabled" : ""} class="date-day ${sun?.day === this.state.day ? "active" : ""
            }" data-day="${sun?.day}">${sun?.day || ""}</button></td>
    </tr>
        `;
        })
        .join("")}
    
    
    
  </table>
        `;
  }
  get backEl() {
    return document.querySelector("*[data-back-month]");
  }
  get nextEl() {
    return document.querySelector("*[data-next-month]");
  }
  onBack() {
    const date = new Date(this.state.year, this.state.month - 1, 0);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.state.month = month;
    this.state.year = year;
    this.state.day = null;
    this.render();
  }
  onNext() {
    const date = new Date(this.state.year, this.state.month + 1, 0);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.state.month = month;
    this.state.year = year;
    this.state.day = null;
    this.render();
  }
  onDaySelect(day) {
    this.state.day = day;
    this.timePicker.date = new Date(
      this.state.year,
      this.state.month,
      this.state.day
    );
    this.render();
  }
  afterRender() {
    const self = this;
    this.backEl.addEventListener("click", this.onBack.bind(this));
    this.nextEl.addEventListener("click", this.onNext.bind(this));
    document.querySelectorAll("*[data-day]").forEach((dayEl) => {
      dayEl.addEventListener("click", () => {
        const day = dayEl.getAttribute("data-day");
        self.onDaySelect(parseFloat(day));
      });
    });
  }
}
class TimePicker {
  state = {
    timeIndex: null,
    date: null,
  };
  constructor(element) {
    this.element = element;
    this.render();
  }
  render() {
    this.element.innerHTML = this.HTML;
    this.afterRender();
  }
  set date(date) {
    this.state.date = date;
    this.render();
  }
  get formatedDate() {
    return this.state.date?.toLocaleDateString("en-US");
  }
  get HTML() {
    if (!this.state.date) return "";
    return `
      <div class="flex flex-column">
        <div>${this.formatedDate}</div>
        <div class="flex flex-row">
        ${times
        .map((time, index) => {
          return `
          <button data-time-index="${index}">
            <div>${time.start_time}</div>
            <div>${time.end_time}</div>
          </button>
          `;
        })
        .join("")}  
        
        </div>
      </div>
    
    `;
  }
  onTimeSelect(index) {
    this.state.timeIndex = index;
    document.querySelectorAll("*[data-time-index]").forEach((el) => {
      el.classList.remove("selected");
    });
    const selectedTimeEl = document.querySelector(
      `*[data-time-index="${index}"]`
    );
    if (selectedTimeEl) {
      selectedTimeEl.classList.add("selected");
    }
  }
  afterRender() {
    const self = this;
    document.querySelectorAll("*[data-time-index]").forEach((el) => {
      el.addEventListener("click", () => {
        self.onTimeSelect(parseFloat(el.getAttribute("data-time-index")));
      });
    });
  }
}
class DatePage {
  datePicker = null;
  constructor() { }
  get HTML() {
    return `
    <div class="page-name">Date Page</div>
    <div class="date-page flex flex-row">
      <div class="date-picker-container">
        <div data-date-picker></div>
      </div>
      <div class="time-picker-container">
        <div data-time-picker></div>
      </div>
    </div>
    `;
  }
  get datePickerEl() {
    return document.querySelector("*[data-date-picker]");
  }
  get timePickerEl() {
    return document.querySelector("*[data-time-picker]");
  }
  afterRender() {
    this.datePicker = new DatePicker({
      datePickerEl: this.datePickerEl,
      timePickerEl: this.timePickerEl,
    });
  }
  onSubmit() {
    if (this.datePicker.state.day == null) {
      return "Select a day";
    } else if (this.datePicker.timePicker.state.timeIndex == null) {
      return "Select time";
    }
  }
}
class ConfirmationPage {
  constructor(pages) {
    this.pages = pages;
  }
  
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };
  
  
  get HTML() {
    return `
      <div class="page-name">Confirmation Page</div>
      <form id="confirmation-form">
        <div>
          <div class="form-row">
            <label class="form-label" for="firstName">First name*</label>
            <input class="form-input" name="firstName" id="firstName" required>
          </div>
          <div class="form-row">
            <label class="form-label" for="lastName">Last name*</label>
            <input class="form-input" name="lastName" id="lastName" required>
          </div>
        </div>
        <div>
          <div class="form-row">
            <label class="form-label" for="email">E-mail*</label>
            <input class="form-input" name="email" id="email" type="email" required>
          </div>
          <div class="form-row">
            <label class="form-label" for="phone">Phone*</label>
            <input class="form-input" name="phone" id="phone" type="tel" required>
          </div>
        </div>
      </form>
  
      <div class="selected-info">
          <div>Staff : ${array[0].name}</div>
          <div> Service : ${array[1].name}</div>
          <div>Date : 2022-03-04 / 09:30-10:00</div>
          <div>Price :${array[1].price}</div>
      </div> 
    `;
  }

  get formEl() {
    return document.querySelector("#confirmation-form");
  }
  
  afterRender() { }
  
  onSubmit() {
    const form = this.formEl;
    const obj = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
    };
    array.push(obj)
    if (!obj.firstName || !obj.lastName || !obj.email || !obj.phone) {
      return "Fill all fields";
    }
  }
}



class Footer {
  state = {
    hint: null,
  };
  constructor() { }
  get nextBtn() {
    return document.querySelector("#page *[data-next]");
  }
  get backBtn() {
    return document.querySelector("#page *[data-back]");
  }
  get hintEl() {
    return document.querySelector("#page *[data-hint]");
  }
  changeHint(hint) {
    if (hint) {
      this.hintEl.innerHTML = hint;
      this.hintEl.classList.remove("hidden");
    } else {
      this.hintEl.classList.add("hidden");
    }
  }
}
class Pagination {
  footer = new Footer();
  pages = [
    new StuffPage(),
    new ServicePage(),
    new DatePage(),
    new ConfirmationPage(),
  ];
  currentPageIndex = 0;
  selectedData = {};
  constructor() {
    this.footer.backBtn.addEventListener("click", this.onBack.bind(this));
    this.footer.nextBtn.addEventListener("click", this.onNext.bind(this));
    this.goTo(this.currentPageIndex);
  }
  onPageChange(index) {
    this.currentPageIndex = index;
    console.log("currentPageIndex" , this.currentPageIndex);
  
  
    if (this.currentPageIndex === 0) {
      this.footer.backBtn.classList.add("hidden");
    } else {
      this.footer.backBtn.classList.remove("hidden");
    }
  }
  onBack() {
    this.goTo(this.currentPageIndex - 1);
  }
  onNext() {
    const newIndex = this.currentPageIndex < 3 ? this.currentPageIndex + 1 : undefined;
    const hint = this.pages[this.currentPageIndex].onSubmit();
    
    if (hint) {
      this.footer.changeHint(hint);
    } else {
      this.footer.changeHint(null);
      if (this.currentPageIndex === 2) {
        this.selectedData.staff = this.pages[0].state.stuffId;
        this.selectedData.service = this.pages[1].state.serviceId;
        this.selectedData.date = this.pages[2].datePicker.state.day;
        // this.selectedData.timeIndex = this.pages[2].timePicker.state.timeIndex;

        const findedStaff = staff.find(item => item.id == this.selectedData.staff)
        const findedService = services.find(item => item.id == this.selectedData.service )
        array.push(findedStaff, findedService)
        console.log(this.selectedData);
        console.log(array);
      }

      this.goTo(newIndex);
    }
  
}
  renderInnerPage(HTML) {
    // console.log("html", HTML);
    document.querySelector(`#inner-page`).innerHTML = HTML;
  }
  goTo(index){
    if (index !== undefined) {   
      this.renderInnerPage(this.pages[index].HTML);
      this.pages[index].afterRender();
      this.onPageChange(index);
    }else {
      alert("Succes")
    }
  }
}

new Pagination();
