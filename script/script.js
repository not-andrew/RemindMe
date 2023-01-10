
//get form element
const form = document.getElementById('toDoForm');
//get todolist element
const toDoList=document.getElementById('toDoList');
//crete vector with all todos
let v=[];
//item id counter
let itemCounter=0;
//vector with selected items
let selected=[];
//vector with done items
let done=[];
//get from localstorage
let lsData=window.localStorage.getItem("todos");
if(lsData!=null)
{
    v=JSON.parse(lsData);
    v.forEach(element => {
        //create element with data from localstorage
        createItem(element);
        //reset id in vector
        element.id=itemCounter;
        //resets id to avoid large numbers
        itemCounter++; 
    });
}

//make show active and show completed checkmarks active
document.getElementById("showDone").checked=true;
document.getElementById("showUndone").checked=true;



//event listener for adding item
form.addEventListener('submit', (event) =>{
   

    //stop page from reloading
    event.preventDefault();

    //get description input text content
    let descriptionInput=document.getElementById('descriptionInput').value;

    if (descriptionInput=="") return;
    
    //current date and time
    const date=new Date();

    //add todo to vector
    v.push({
            id:itemCounter,
            description:descriptionInput,
            done:false,
            timestamp:date.toString().slice(0,21)
    });

    //update localStorage
    updateLocalStorage();

    console.log(v);

    //create a new list element
    createItem(v[v.length-1] );

    //increment item id
    itemCounter++;
    //reset form
    event.target.reset();

});

//createitem function
function createItem(itemData)
{
    let toDo=document.createElement("li");

    toDo.id=itemData.id;
    //add item class
    toDo.classList.add("item");

    toDo.innerHTML=`
        <div class="item_title">
            <input type="checkbox" class="checkmark"> <p class="date_title">${itemData.timestamp} </p></div>
        <label class="item_description"></label>
        <div class="item_buttons">
            <button class="done_button" id="done${itemData.id}"></button>
            <button class="delete_button" id="delete${itemData.id}"></button>
        </div>
    `;
    //prevent code injection
    toDo.getElementsByClassName("item_description")[0].textContent=itemData.description;

    //add list element to toDoList
    toDoList.appendChild(toDo);

    //add eventlistener to delete button
    document.getElementById('delete'+itemData.id).addEventListener("click", (event)=>{
        let id=event.target.parentElement.parentElement.id;
        removeItem(id);
    });

    //add event listener to done button
    document.getElementById('done'+itemData.id).addEventListener("click", (event)=>{
        //check if the eement is already done
        if (event.target.parentElement.parentElement.classList.contains("done"))
        {
            //unmark as done
            unmarkAsDone(event.target.parentElement.parentElement);
        }

        else
        {
            //mark as done
            markAsDone(event.target.parentElement.parentElement);
        }
        // console.log(done);
    });

    //add eventlistener to checkbox
    toDo.querySelector(`input[type="checkbox"]`).addEventListener("click", (event)=>{
        if (event.target.checked) 
        {
            event.target.checked=false;
            selectItem(event.target.parentElement.parentElement);
        }

        else 
        {
            event.target.checked=true;
           deselectItem(event.target.parentElement.parentElement);
        }

   

        console.log(selected);
    });

     //add event listener for double click to edit
    toDo.querySelector("label").addEventListener("dblclick", (event)=>{
        //copy text from item
        let text=event.target.textContent;
        //create textbox and add the text
        let input=document.createElement("textarea");
        input.value=text;

        

        //when input is left
        input.onblur=function(){
            text=input.value;
            //update text in item
            event.target.textContent=text;
            //find item in v and update text then update localstorage
            v.find(element=>element.id==event.target.parentElement.id).description=text;
            updateLocalStorage();
            //remove input
            
            input.remove();
        }
        
        //remove html from item
        event.target.innerHTML='';
        //append input
        event.target.appendChild(input);
        input.classList.add("description_input");
        //make input box active
        input.focus();
    });

     //check if item is already done
     if(itemData.done==true)
     {
         markAsDone(toDo);
     }
}

function updateLocalStorage()
{
     //transform vector to json for localstorage
     let test=JSON.stringify(v);
     //remove outdated todos
     window.localStorage.removeItem('todos');
     //add new todos
     window.localStorage.setItem('todos', test);
     console.log(v);
}

function removeItem(id)
{
    //get element to delete
    let item=document.getElementById(id);
    console.log("deleted id:",id);
    //find position of element
    let index=v.indexOf(v.find(element => element.id==id));
    //delete element from vector
    v.splice(index,1);
    
    //add class for animation
    item.classList.add("removing");
    //add eventlistener for animation end
    item.addEventListener("transitionend", (event)=>{
         //remove from page
        event.target.remove();
    })

    console.log(v);

    updateLocalStorage();
}


//delete selected button
document.getElementById("deleteSelected").addEventListener("click", (event)=>{
    selected.forEach(element=>{
        removeItem(element.id);
    });
    selected=[];
    //if all items are selected then all are deleted and checkmark should be unchecked
    document.getElementById("selectAll").checked=false;
})

//select all button
document.getElementById("selectAll").addEventListener("click",(event)=>{
    //select all
    if(event.target.checked==true){
        selected=[];
        v.forEach(element=>{
            //get item
            let item=document.getElementById(element.id);
            //select item
            selectItem(item);
        });
    }
    //deselect all
    else
    {
        v.forEach(element=>{
            //get item
            let item=document.getElementById(element.id);
            //deselect item
            deselectItem(item);
        });
    }
})



//Mark all as done
document.getElementById("doneAll").addEventListener("click",(event)=>{
    if(event.target.checked==true){
        v.forEach(element=>{
            //get item
            let item=document.getElementById(element.id);
            //mark item as done
            markAsDone(item);
        })
    }

    else
    {
        v.forEach(element=>{
            //get item
            let item=document.getElementById(element.id);
            //mark item as done
            unmarkAsDone(item);
        })
    }
})

//delete done items
document.getElementById("deleteDone").addEventListener("click", (event)=>{
    done.forEach(element=>{
        removeItem(element.id);
    });
    done=[];

    //if all items are done then all are deleted and checkmark should be unchecked
    document.getElementById("doneAll").checked=false;
})

//show done items
document.getElementById("showDone").addEventListener("click", (event)=>{
    if(event.target.checked==true)
        showDone();

    else
        hideDone();
})

//show undone items
document.getElementById("showUndone").addEventListener("click", (event)=>{
    if(event.target.checked==true)
        showUndone();

    else
        hideUndone();
})



function markAsDone(item)
{
    if(item.classList.contains("done")||item.style.display=="none") return;
    //remove done class from item
    item.classList.add("done");
    //get done button
    let done_button=item.getElementsByClassName("done_button");
    //make button green
    done_button[0].style.opacity="100%";
    //add item to done vector
    done.push(item);
    //create overlay element
    let overlay=document.createElement("div");
    //add overlay class
    overlay.classList.add("overlay");
    //append overlay to item
    item.appendChild(overlay);
    //update done field in v
    updatev(item);

    //if all items are done check checkbox
    if(done.length==v.length) document.getElementById("doneAll").checked=true;

    //check if item should be hidden
    if(document.getElementById("showDone").checked==false) hideDone();

}

function unmarkAsDone(item)
{
    if(!item.classList.contains("done")||item.style.display=="none") return;
    //remove done class from item
    item.classList.remove("done");
    //get done button
    let done_button=item.getElementsByClassName("done_button");
    //make done button gray
    done_button[0].style.opacity="20%";
    //remove item from done vector
    done.splice( done.indexOf(item) ,1);
    //get overlay element
    let overlay=item.getElementsByClassName("overlay");
    //remove overlay element
    overlay[0].remove();
    //update done field in v
    updatev(item);

    //if an item is marked as undone uncheck checkmark
    document.getElementById("doneAll").checked=false;

    //check if item should be hidden
    if(document.getElementById("showUndone").checked==false) hideUndone();
}

function selectItem(item)
{
    if(item.querySelector(`input[type="checkbox"]`).checked==true) return;
    //mark checkbox as checked
    item.querySelector(`input[type="checkbox"]`).checked=true;
    //change border when item is selected
    item.style.border="2px #F06A4D solid";
    //add item to selected vector
    selected.push(item);
    if(selected.length==v.length) document.getElementById("selectAll").checked=true;
}

function deselectItem(item)
{
    if(item.querySelector(`input[type="checkbox"]`).checked==false) return;
    //mark checkbox as unchecked
    item.querySelector(`input[type="checkbox"]`).checked=false;
    //get index of item in selected vector
    let index=selected.indexOf(item);
    //remove item from selected vector
    selected.splice(index,1);
    //make border gray
    item.style.border="2px #3c3c3c solid";

    document.getElementById("selectAll").checked=false;
}

function hideDone()
{
    done.forEach(element=>{
        element.style.display="none";
    });
    console.log("ok");
}

function showDone()
{
    done.forEach(element=>{
        element.style.display="list-item";
    });
}

function hideUndone()
{
    v.forEach(element=>{
        //get item
        let item=document.getElementById(element.id);
        //check if item is undone
        if(!item.classList.contains("done"))
        {
            item.style.display="none";
        }
    })
}

function showUndone()
{
    v.forEach(element=>{
    //get item
        let item=document.getElementById(element.id);
        //check if item is undone
        if(!item.classList.contains("done"))
        {
            item.style.display="list-item";
        }
    })
}

function updatev(item)
{
    //find index of item in v
    let index=v.indexOf(v.find(element => element.id==item.id));
    //update item data in v
    if(item.classList.contains("done")) v[index].done=true;
    else v[index].done=false;
    //update localstorage
    updateLocalStorage();
}