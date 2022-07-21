import './style.css'

type Car = {
  id: number,
  type: string,
  name: string,
  image: string,
  price: number,
  year:string
  bodytype: string
  fuel:string
  onSale:boolean
}

type State = {
   cars: Car[];
    searchTerm: string;
    selectedItem: Car | null
    page: 'store' | 'item' | 'filtered'
    modal: 'search' |''
}

const state: State = {
    cars: [],
    searchTerm: "",
    selectedItem: null,
    modal: '',
    page: 'store',
}

function renderFilteredItems() {

    let filteredItems = state.cars.filter(item => {
        return item.name.toLowerCase().includes(state.searchTerm.toLowerCase())
    })
    return filteredItems
  }

function renderSearchModal () {
    let mainEl = document.querySelector('main')

    let wrapperEl = document.createElement('div')
    wrapperEl.className = 'modal-wrapper'
  
    let containerEl = document.createElement('div')
    containerEl.className = 'modal-container'
  
    let closeButton = document.createElement('button')
    closeButton.textContent = 'X'
    closeButton.className = 'modal-close-button'
    closeButton.addEventListener('click', function () {
      state.modal = ''
      render()
    })

    let divEl = document.createElement('div')
    divEl.className = 'modal-search'
  
    let formEl = document.createElement('form')
    formEl.className = 'search-form'
    formEl.addEventListener('submit', function (event) {
        event.preventDefault()
        state.searchTerm = inputEl.value
        state.page = 'filtered'
        state.modal = ''
        render()
    })

    let inputEl = document.createElement('input')
    inputEl.placeholder = 'Search...'
    inputEl.className = 'search-input'

    formEl.append(inputEl)
    divEl.append( formEl)
    containerEl.append(closeButton, divEl)
    wrapperEl.append(containerEl)
    mainEl.append(wrapperEl)
  }


function selectedItem(item: Car) {
    state.selectedItem = item;
}

function deselectItem() {
    state.selectedItem = null;
}

function getCar(){
    fetch('http://localhost:4999/cars')
    .then(res => res.json())
    .then(data => {
        state.cars = data
        render()
    })
}

function renderCar(){
    let mainEl = document.querySelector('main')
    for(let item of renderFilteredItems()){
        if(item.onSale){
        let divEl = document.createElement('div')
        divEl.className = 'store-item'
        divEl.addEventListener('click', function(){
            state.page = 'item'
            selectedItem(item)
            render()
        })

        let imgEl = document.createElement('img')
        imgEl.src = item.image
        imgEl.alt = item.name
        imgEl.width = 250
        let h3El = document.createElement('h3')
        h3El.innerText = item.name
        let div2El = document.createElement('div')
        div2El.className = 'on-Sale'
        let pEl = document.createElement('p')
        pEl.innerText = `$${item.price}`
        let spanEl = document.createElement('span')
        spanEl.innerText = `$${item.onSale}`
        div2El.append(pEl, spanEl)
        divEl.append(imgEl, h3El, div2El)
        mainEl.append(divEl)
        }
        else {

        let divEl = document.createElement('div')
        divEl.className = 'store-item'
        divEl.addEventListener('click', function(){
            state.page = 'item'
            selectedItem(item)
            render()
        })
        let imgEl = document.createElement('img')
        imgEl.src = item.image
        imgEl.alt = item.name
        imgEl.width = 250
        let h3El = document.createElement('h3')
        h3El.innerText = item.name
        let pEl = document.createElement('p')
        pEl.innerText = `$${item.price}`
        divEl.append(imgEl, h3El, pEl)
        mainEl.append(divEl)
        }
    }
}

function renderSelectedItemPage(){
    let mainEl = document.querySelector('main')
    let selectedItem = state.selectedItem

    let divEl = document.createElement('div')
    divEl.className = 'selected-item'

    let imgEl = document.createElement('img')
    imgEl.src = selectedItem.image
    imgEl.alt = selectedItem.name
    imgEl.width = 500

  
    let infoEl = document.createElement('div')
    infoEl.className = 'selected-item-info'
    
    let h3El = document.createElement('h3')
    h3El.innerText = selectedItem.name
    h3El.className = 'selected-item-name'
    let h4El = document.createElement('h4')
    h4El.innerText = selectedItem?.bodytype
    h4El.className = 'selected-item-bodytype'
    let h4El2 = document.createElement('h4')
    h4El2.innerText = selectedItem?.year
    let h4El3 = document.createElement('h4')
    h4El3.innerText = selectedItem?.fuel
    let phone = document.createElement('p')
    phone.textContent = 'Phone Number: 048334745849' 

    let priceEl = document.createElement('div')
    priceEl.className = 'selected-item-price'

    if(selectedItem?.dateEntered === "2021/07/10"){
        let pEl = document.createElement('p')
        pEl.innerText = `New!`
        pEl.className = "recently-added"
        priceEl.append(pEl)
    }

    if(selectedItem?.onSale){

    let pEl = document.createElement('p')
    pEl.innerText = `$${selectedItem.price}`
    pEl.className = 'selected-item-price-alone'

    let spanEl = document.createElement('span')
    spanEl.innerText = `$${selectedItem.onSale}`
    spanEl.className = 'selected-on-Sale'
    priceEl.append(pEl, spanEl)
    } else {
        let pEl = document.createElement('p')
        pEl.innerText = `$${selectedItem.price}`
        priceEl.append(pEl)
    }

    let buttonEl = document.createElement('button')
    buttonEl.innerText = 'TradeCar'
    buttonEl.className = 'add-to-cart-button'
    buttonEl.addEventListener('click', function(){
        if(selectedItem?.onSale){
        state.total = state.total + selectedItem.onSale
    } else {
        state.total = state.total + selectedItem.price
    }

        render()
    })

    
    infoEl.append( h3El,h4El,h4El2,h4El3,priceEl,phone)
    divEl.append(imgEl, infoEl)
    mainEl.append(divEl)
        
}



function render(){
    let mainEl = document.querySelector('main')
    mainEl.innerHTML = ''


    let searchEl = document.querySelector('.search-bar')
    searchEl.addEventListener('click', function(){
        state.modal = 'search'
        render()
    })


    if (state.modal === 'search') renderSearchModal()

    if(state.page === 'item'){
        renderSelectedItemPage()
    } else{

    renderCar()
    }
}

let logoEl = document.querySelector('.the-logo')
    logoEl?.addEventListener('click', function (){
    deselectItem()
    state.page = 'store'
    state.modal = ""
    state.searchTerm = ""
    render()
})

function postCars( type: String, name: String, image: String, price: Number, year: String, bodytype:String, fuel: String) {
    let url = 'http://localhost:4999/cars'
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: type,
        name: name,
        image: image,
        price: price,
        year: year,
        bodytype:bodytype,
        fuel: fuel
      })
    }
    fetch(url, options)
      .then(resp => resp.json())
      .then(newCar => {
        state.cars.push(newCar)
        render()
      })
      .catch(response => {
        console.log(response);
      });
  }
  function renderNewCar() {
    let sidebarEl = document.querySelector('.sidebar')
    if (sidebarEl === null) return
  
    let carForm = document.createElement('form')
    carForm.addEventListener('submit', function (event) {
      event.preventDefault()
      postCars(typeInput.value, nameInput.value, imageInput.value, priceInput.value, bodytypeInput.value, yearInput.value, fuelInput.value)
      carForm.reset()
      render()
  
    })
  
    let typeInput = document.createElement('input')
    typeInput.type = 'type'
    typeInput.required = true
    typeInput.placeholder = 'Add the car type'

    let nameInput = document.createElement('input')
    nameInput.type = 'type'
    nameInput.required = true
    nameInput.placeholder = 'Add the car name'
  
    let imageInput = document.createElement('input')
    imageInput.name = 'Image'
    imageInput.required = true
    imageInput.placeholder = 'img URL'

    let priceInput = document.createElement('input')
   priceInput.type = 'Price'
   priceInput.required = true
    priceInput.placeholder = 'Add the car price'

     let yearInput = document.createElement('input')
     yearInput.type = 'Year'
     yearInput.required = true
     yearInput.placeholder = 'Add the car year'

     let bodytypeInput = document.createElement('input')
     bodytypeInput.type = 'bodytype'
     bodytypeInput.required = true
     bodytypeInput.placeholder = 'Add the car bodytype'

     let fuelInput = document.createElement('input')
     fuelInput.type = 'fuel'
     fuelInput.required = true
     fuelInput.placeholder = 'Add the car fuel type'

    let formCarbtn = document.createElement('button')
    formCarbtn.type = 'submit'
    formCarbtn.textContent = 'submit'
  
    carForm.append( typeInput, nameInput, imageInput, priceInput, yearInput, bodytypeInput,fuelInput, formCarbtn)
    sidebarEl.append(carForm)
  
  }
  renderNewCar()
 
getCar()
render()

