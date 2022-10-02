const tasks = [
];

(function(arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task
    return acc
  }, {})

  const themes = {
    default: {
      '--base-text-color': '#212529',
      '--header-bg': '#007bff',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#007bff',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#0069d9',
      '--default-btn-border-color': '#0069d9',
      '--danger-btn-bg': '#dc3545',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#bd2130',
      '--danger-btn-border-color': '#dc3545',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#80bdff',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
    dark: {
      '--base-text-color': '#212529',
      '--header-bg': '#343a40',
      '--header-text-color': '#fff',
      '--default-btn-bg': '#58616b',
      '--default-btn-text-color': '#fff',
      '--default-btn-hover-bg': '#292d31',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#b52d3a',
      '--danger-btn-text-color': '#fff',
      '--danger-btn-hover-bg': '#88222c',
      '--danger-btn-border-color': '#88222c',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
    light: {
      '--base-text-color': '#212529',
      '--header-bg': '#fff',
      '--header-text-color': '#212529',
      '--default-btn-bg': '#fff',
      '--default-btn-text-color': '#212529',
      '--default-btn-hover-bg': '#e8e7e7',
      '--default-btn-border-color': '#343a40',
      '--default-btn-focus-box-shadow':
        '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
      '--danger-btn-bg': '#f1b5bb',
      '--danger-btn-text-color': '#212529',
      '--danger-btn-hover-bg': '#ef808a',
      '--danger-btn-border-color': '#e2818a',
      '--input-border-color': '#ced4da',
      '--input-bg-color': '#fff',
      '--input-text-color': '#495057',
      '--input-focus-bg-color': '#fff',
      '--input-focus-text-color': '#495057',
      '--input-focus-border-color': '#78818a',
      '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    },
  };

  let lastSelectedTheme = localStorage.getItem('app_theme') || 'default'

  //elements UI
  const listContainer = document.querySelector('.tasks-list-section', '.list-group')
  const form = document.forms['addTask'] //обращаемся к формале 
  const inputTitle = form.elements['title'] //обращаемся к элементам формы через elements
  const inputBody = form.elements['body'] //обращаемся к элементам формы через elements
  const themeSelect = document.getElementById('themeSelect')

  //events
  setTheme(lastSelectedTheme)
  renderAllTasks(objOfTasks) //Функция котороая рендерит таски и на вход получает массив тасков
  form.addEventListener('submit',onFormSubmitHandler)// слушатель формы
  listContainer.addEventListener('click', onDelHandler) //обрабатывем список который генерируется нашей задачей

  themeSelect.addEventListener('change', onThemeSelecteHandler)

  function renderAllTasks(tasksList) { //проверка того что таски переданны

    if (!tasksList) {
     throw Error(`TASK LITS EMPTY`)
      return
    }

    const fragment = document.createDocumentFragment() //создаем фрагмент чтоб не добавлять задачи по одной
    Object.values(tasksList).forEach(task => { // перебераем массив тасков
      const li = listItemTemplate(task) //на каждой итерации передаем один таск в функцию
      fragment.appendChild(li)
    })
    listContainer.appendChild(fragment)
  }

  function listItemTemplate({_id, title, body} = {}) {// создает элемнтв списка
   const li = document.createElement('li')
   li.classList.add('list-group-item', 
   'd-flex', 
   'align-items-center', 
   'flex-wrap', 
   'mt-2')

   li.setAttribute('data-task-id', _id) // добавляем data-id

   const span = document.createElement('span')
   span.textContent = title
   span.style.fontWeight = 'bold'

   const delBtn = document.createElement('button')
   delBtn.textContent = 'Delete'
   delBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn')

   const article = document.createElement('p')
   article.textContent = body
   article.classList.add('mt-2', 'w-100')

   li.appendChild(span)
   li.appendChild(delBtn)
   li.appendChild(article)

   return li
  }

  function onFormSubmitHandler (e) { //добавление таски в список задач
    e.preventDefault()
    const titleValue = inputTitle.value //разобрали значение имтутов через value
    const bodyValue = inputBody.value //разобрали значение имтутов через value

    if (!titleValue || !bodyValue) { //создали проверку 
      alert('pls add title or body')
      return
    }
    const task = createNewTask(titleValue, bodyValue) 
    const listItem = listItemTemplate(task)
    listContainer.insertAdjacentElement('afterbegin', listItem)
    form.reset()
  }

  function createNewTask(title, body) { //создает 1 объект задачи
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}` //генерируем новый id
    }
    objOfTasks[newTask._id] = newTask //записываем занчение 

    return{...newTask}
  }

  function delTask (id) { //прнимает id
    const { title } = objOfTasks[id] //вытаскиваем title из объекта
    const isConfirm = confirm(`Are u sure?: ${title}`) //вызываем confirm 
    if (!isConfirm) { //проверяем на что тыкнул в confirm
      return isConfirm
    }
    delete objOfTasks[id] //удаляем таск по id
    return isConfirm //возвращаем результат в функцию
  }

  function delTaskFormHTML(confirmed, el) {
    if (!confirmed) return //проверяем хотят ли удалить 
    el.remove() //удаляем элемент
  }

  function onDelHandler ({target}) { //функция котрая прнимает таргет и проверятет куда мы тыкнули
    if (target.classList.contains('delete-btn')) { //если тыкнули на кнопку то 
      const parent = target.closest('[data-task-id]') //созадет родителя с task id
      const id = parent.dataset.taskId //находим id
      const confirmed = delTask(id) // и передаем в функцию deltask
      delTaskFormHTML(parent, confirmed) //прнимаем переданный confirmed и добавляем parent, после чего вызываем функцию
    }
  }

  function onThemeSelecteHandler(e) {
    const selectedTheme = themeSelect.value
    const isConfirm = confirm(`Are u sure?: ${selectedTheme}`)
    if(!isConfirm) {
      selectedTheme.value = lastSelectedTheme
      return
    }
    setTheme(selectedTheme)
    localStorage.setItem('app_theme', selectedTheme)
  }

  function setTheme (name) {
    const selectedThemeObj = themes[name]
    Object.entries(selectedThemeObj).forEach(([key, value]) =>{
      document.documentElement.style.setProperty(key, value)
    })
  }
})(tasks);
