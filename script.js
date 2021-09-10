const controller = async (url, method, obj) => {
   let options = {
      method: method,
      headers: {
         "content-type": "application/json"
      }
   }

   if(obj) 
      options.body = JSON.stringify(obj)

   let request = await fetch(url, options),
      response = await request.json()

   return response
}

const URL = `https://6127d6c1c2e8920017bc0edf.mockapi.io/heroes`,
   heroesForm = document.querySelector(`#heroesForm`),
   heroesTable = document.querySelector(`#heroesTable`);
     

heroesForm.addEventListener(`submit`, e => {
   e.preventDefault()

   let heroName = heroesForm.querySelector(`input[data-name="heroName"]`),
      heroComics = heroesForm.querySelector(`select[data-name="heroComics"]`);

   data = {
      name: heroName.value,
      comics: heroComics.value,
      favourite: false,
   }

   controller(URL, `GET`)
      .then(
         dataCheck => {
            let arr = []
            dataCheck.forEach(item => {
               arr.push(item.name)
            })
            arr.includes(data.name) ? alert(`Such a hero is already in the table. Enter another hero.`) : controller(URL, `POST`, data).then(data => renderHero(data))
         }
      )
})

const renderBody = () => {
   controller(URL, `GET`)
      .then(
         data => data.forEach(item => {
            renderHero(item)
         })
      )
}

const delHero = e => {
   let elem = e.target,
      del = elem.closest(`tr`);

   controller(`${URL}/${elem.dataset.id}`, `DELETE`)
      .then(
         () => del.remove()
      )
}

const favHero = e => {
   let elem = e.target,
      favourite = elem.checked;

   controller(`${URL}/${elem.dataset.id}`, `PUT`, {favourite: favourite})
}

const renderHero = data => {
   let tr = document.createElement(`tr`),
      tdLabel = document.createElement(`td`),
      label = document.createElement(`label`),
      input = document.createElement(`input`),
      tdBtnDel = document.createElement(`td`),
      btnDel = document.createElement(`button`);

      label.className = `heroFavouriteInput`;
      label.innerText = `Favourite:`;

      input.type = `checkbox`;
      input.checked = data.favourite ? `checked` : ``;
      input.dataset.id = data.id;
      input.addEventListener(`change`, favHero);

      btnDel.innerHTML = `Delete`;
      btnDel.dataset.id = data.id;
      btnDel.addEventListener(`click`, delHero);

   tr.innerHTML = `<td>${data.name}</td>
                  <td>${data.comics}</td>`;
   tr.append(tdLabel);
   tdLabel.append(label);
   label.append(input);
   tr.append(tdBtnDel);
   tdBtnDel.append(btnDel);
   heroesTable.querySelector(`tbody`).append(tr);
}

renderBody()
