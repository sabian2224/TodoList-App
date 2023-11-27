
       //MVC(Model,View, Controller) is way to structure our code
           
          //1.MODEL
          //Contain all the code that saves and manages data.

          let todos = [];//Will be an array of objects

          //retrvie local storage 
          //getItem, returns the string associated with key
          const savedTodos = JSON.parse(localStorage.getItem('key'));//JSON.parse converts the key to an array
          if(Array.isArray(savedTodos)){
            todos = savedTodos;
          }
         
        
          //Create Todo
          function createTodo(title, dueDate){
            
              //we add an empty string, to make the id a string
              //because it would be an error to if statements in deleteToDo function
              //because compares a int with a string 
              const id = ''+ new Date().getTime(); //current time in millyseconds

              todos.push({
                  title: title,
                  dueDate: dueDate,
                  id: id
                 
              });

              saveTodos();
          }

          //Remove Todo
           function removeTodo(idToDelete){

                todos = todos.filter(function(todo){
                    //if the id of this todo matches idToDelete, return false 
                    //For everything else, return true
                    if(todo.id === idToDelete){
                        return false; //removes the element from the array
                    }
                    else{
                        return true;//keeps the element in array
                    }
                });

                saveTodos();
           }

           //toggleTodo 
           function toggleTodo(todoId,checked){
             todos.forEach(function(todo){
                if(todo.id === todoId){
                    todo.isDone = checked;
                }
             });

             saveTodos();
           }
          

           //MVC (Save & Retrieve)
           
           //save 
           function saveTodos(){
            //saves a string associated with a key
             localStorage.setItem('key', JSON.stringify(todos));
           }

          
           //set Editing
           function setEditing(todoId){

             todos.forEach(function(todo){
                if(todo.id === todoId){
                    todo.isEditing = true;
                }
             });

             saveTodos();
           }
          
           function updateTodo(todoId, newTitle, newDate){
             todos.forEach(function(todo){
                if(todo.id === todoId){
                    todo.title = newTitle;
                    todo.dueDate = newDate;
                    todo.isEditing = false;
                }
             });
             saveTodos();
           }


          
           //2.VIEW , contains all the code that manages visuals 


           render();

          function render(){
            //reset the list 
              document.getElementById('toDoList').innerHTML = '';

              todos.forEach(function(todo){
                let element = document.createElement('div');
                element.className = 'element-of-list';

                if(todo.isEditing === true){
                  //textBox
                    const textbox = document.createElement('input');
                    textbox.type = 'text';
                    textbox.id = 'edit-title-' + todo.id;
                    element.appendChild(textbox);
                    textbox.className = 'Text-Picker2';
                    


                     //checkbox 
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.onchange = checkTodo;
                    checkbox.dataset.todoId = todo.id;
                    checkbox.className = 'Check-Box';
                    if(todo.isDone === true){
                        checkbox.checked = true;
                    }
                    else{
                        checkbox.checked = false;
                    }
                    element.appendChild(checkbox);

                    const datePicker = document.createElement('input');
                    datePicker.type = 'date';
                    datePicker.id = 'edit-date-' + todo.id;
                    element.appendChild(datePicker);
                    datePicker.className = 'Date-Picker2';

                    

                  
                    const updateButton = document.createElement('button');
                    updateButton.innerText = 'Update';
                    updateButton.className = 'Update-Button';
                    updateButton.dataset.todoId = todo.id;
                    updateButton.onclick = onUpdate;
                    element.appendChild(updateButton);
                    updateButton.className = 'Update-Button';

                    // If this todo is not being edited, render what we had before
                    // and add an "Edit" button.
                }
                else{

                    const todoTitle = document.createElement('div');
                    todoTitle.innerText = todo.title;
                    todoTitle.className = 'todo-title';
                    element.appendChild(todoTitle);

                    let bottomContainer = document.createElement('div');
                    bottomContainer.className =  'bottom-container';

                    let options = document.createElement('div');
                    options.className = 'options';
                    
                    const dueDateDiv = document.createElement('div');
                    dueDateDiv.innerText ='Due date: ' +todo.dueDate;
                    dueDateDiv.className = 'due-date';
                    bottomContainer.appendChild(dueDateDiv);



                   
                    //Checkbox 
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.onchange = checkTodo;
                    checkbox.className = 'Check-Box';
                    checkbox.dataset.todoId = todo.id;
                    if(todo.isDone === true){
                        checkbox.checked = true;
                    }
                    else{
                        checkbox.checked = false;
                    }
                    options.appendChild(checkbox);


                    //Edit button
                    const editButton = document.createElement('button');
                    editButton.innerText = 'Edit';
                    editButton.style = 'margin-left: 12px';
                    editButton.className = 'edit-button';
                    editButton.onclick = onEdit;
                    editButton.dataset.todoId = todo.id;
                    options.appendChild(editButton);
                     

                    //Delete button
                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = 'Delete';
                    deleteButton.className = 'Delete-Button';
                    deleteButton.style = 'margin-left: 12px';
                    deleteButton.id = todo.id; //ID link
                    deleteButton.onclick = deleteTodo;
                    options.appendChild(deleteButton);

                    bottomContainer.appendChild(options);

                    element.appendChild(bottomContainer);
                }
               
                let toDoList = document.getElementById('toDoList');
                toDoList.appendChild(element);
              });
          }

         

          


          //3.CONTROLLER, connects Model and View together
        
          //Add Button
          function addToDo(){
              //text picker variable
              let textbox = document.getElementById('todo-title');
              let title = textbox.value;
              //date picker variable 
              const datePicker = document.getElementById('date-picker');
              const dueDate = datePicker.value;

               // Check if both title and dueDate are not empty
              if (title.trim() === '' || dueDate.trim() === '') {
                alert('Please enter both title and due date.');
                return; // Stop further execution of the function
              }

              
              createTodo(title, dueDate);
              render(); 
          }
           
          
          //Delete Button
          function deleteTodo(event){
              const deleteButton = event.target; /****IMPORTANT****/
              const idToDelete = deleteButton.id;
              
              removeTodo(idToDelete);
              
              render(); 
          }

          //Check Todo 
          function checkTodo(event){
            const checkbox = event.target;

            const todoId = checkbox.dataset.todoId;
            const checked = checkbox.checked;

            toggleTodo(todoId, checked);

            render();
          }
     
          //edit
          function onEdit(event){
            const editButton = event.target;
            const todoId = editButton.dataset.todoId;

            setEditing(todoId);
            render();

          }
           
          //On Update 
          function onUpdate(event){
            const updateButton = event.target;
            const todoId = updateButton.dataset.todoId;

            const textbox = document.getElementById('edit-title-' + todoId);
            const newTitle = textbox.value;

            const datePicker = document.getElementById('edit-date-' + todoId);
            const newDate = datePicker.value;

            updateTodo(todoId, newTitle, newDate);
            render();
          }
    