function clearStorage() {
    localStorage.clear();
}

var recipesBase = [];
var editedRecipeIndex = -1;

function allStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
        archive.push(key + '=' + localStorage.getItem(key));
    }

    console.log(archive);
}

function itIsPreviousHtmlElement(currentElementId, checkedElementIdPhrase) {
    let splitedCheckedId = checkedElementIdPhrase.split("-");
    let id = parseInt(splitedCheckedId.pop());
    if (id === (currentElementId - 1)) {
        return true;
    }
    return false;
}

function moveUp(elementIndex) {
    console.log("moveUp");
    let clickedId = "recipe-" + elementIndex;
    let idToReplace = -1;
    let currentIndex = -1;
    let htmlRecipeElements = document.getElementById("recipeTab").getElementsByTagName("tr");

    for (let i = 0; i < htmlRecipeElements.length - 1; i++) {
        console.log(htmlRecipeElements[i].getAttribute('id'));
        if (elementIndex === parseInt(htmlRecipeElements[i].getAttribute('id').split("-").pop())) {
            currentIndex = (i - 1);
            break;
        }
    }

    if (currentIndex >= 0) {
        let idToMove = htmlRecipeElements[(currentIndex)].getAttribute('id');

        console.log(idToMove);
        let clickedElement = document.getElementById(clickedId);
        let elementToReplace = document.getElementById(idToMove);

        elementToReplace.parentNode.insertBefore(clickedElement, elementToReplace);
    }


}

function moveDown(elementIndex) {
    console.log("moveDown");
    let clickedId = "recipe-" + elementIndex;
    let currentIndex = -1;
    let htmlRecipeElements = document.getElementById("recipeTab").getElementsByTagName("tr");

    for (let i = 0; i < htmlRecipeElements.length - 1; i++) {
        if (elementIndex === parseInt(htmlRecipeElements[i].getAttribute('id').split("-").pop())) {
            currentIndex = (i - 1);
            break;
        }
    }


    if (currentIndex <= htmlRecipeElements.length - 4) {
        let idToMove = htmlRecipeElements[(currentIndex + 2)].getAttribute('id');

        let clickedElement = document.getElementById(clickedId);
        let elementToReplace = document.getElementById(idToMove);

        clickedElement.parentNode.insertBefore(elementToReplace, clickedElement);
    }


}

$(document).ready(function () {

    window.onload = function () {

        let item = localStorage.getItem("recipes");
        if (item === undefined || item === null) {
            let tmp =[];
            localStorage.setItem("recipes", JSON.stringify(tmp));
            item = loadDefaultValues();
            // localStorage.setItem("recipes", JSON.stringify(item));
            //
        } else {
            loadLocalStorageContent();
        }

    };

    $('#showRemoved').on('click', function () {
        removeEditOption();
    });


    function loadDefaultValues() {

        let exampleBase = [{"id": 0, "name": "Jabłka", "count": "1,5", "price": "4,90"}, {
            "id": 1,
            "name": "Bułka",
            "count": "5",
            "price": "0,49"
        }, {
            "id": 2,
            "name": "Bułka",
            "count": "5",
            "price": "0,49"
        }, {
            "id": 3,
            "name": "Bułka",
            "count": "5",
            "price": "0,49"
        }];

        addNewReceipt(exampleBase[0]);
        addNewReceipt(exampleBase[1]);
        addNewReceipt(exampleBase[2]);
        addNewReceipt(exampleBase[3]);


        return exampleBase;

    }


    function loadLocalStorageContent() {
        let localRecipesBase = JSON.parse(localStorage.getItem("recipes"));

        for (let i = 0; i < localRecipesBase.length; i++) {
            if (addNewReceipt(localRecipesBase[i])) {
                recipesBase.push(localRecipesBase[i]);
            }
        }
    }

    function setNewEditOption(index) {
        let $editSelect = $('#editSelect');
        let option = '<option >' + index + '</option>';
        $editSelect.append(option);
    }

    function removeEditOption() {
        let remIndex = 1;
        let $options = $('#editSelect,option');
        for (let i = 0; i < $options.length; i++) {
            if (indexToRemove == $options.innerText) {
                $('#editSelect,option')[i + 1].remove();
                break;
            }
        }
        $options = $('#editSelect,option');

    }

    $('#edit').on('click', function () {
        let $recipesHtmlElements = $('main tbody tr');
        let indexToEdit = -1;
        let elementIdPhrase = "recipe-" + editedRecipeIndex;

        for (let i = 0; i < $recipesHtmlElements.length; i++) {
            if ($($recipesHtmlElements[i]).prop('id') === elementIdPhrase) {
                indexToEdit = i;
                break;
            }
        }

        if (indexToEdit !== (-1)) {
            let recipeToUpdate = {};
            recipeToUpdate.id = editedRecipeIndex;
            recipeToUpdate.name = $('#editName').val();
            recipeToUpdate.price = $('#editPrice').val();
            recipeToUpdate.count = $('#editCount').val();

            let tdElements = document.getElementById(elementIdPhrase).getElementsByTagName("td");
			let tmp=tdElements[4].innerHTML.slice(0,4);
			//alert(tmp);
			
            tdElements[0].innerText = recipeToUpdate.id;
            tdElements[1].innerText = recipeToUpdate.name;
            tdElements[2].innerText = recipeToUpdate.count;
            tdElements[3].innerText = recipeToUpdate.price+"zł";
			tdElements[4].innerHTML=(recipeToUpdate.price*recipeToUpdate.count).toFixed(2)+"zł";
            console.log(tdElements);
			
			 let razem= $('#razem').text().split(/ +/);
            razem[0] = (parseFloat(razem[0].replace(',', '.')) + parseFloat(recipeToUpdate.count) * parseFloat(recipeToUpdate.price)).toFixed(2);
			razem[0]-=tmp[0];
            console.log(razem);
            let sum=razem[0]+" "+razem[1];
            $('#razem').html(sum);
			            $('#editForm').toggle(1000);

        } else {
            console.log("Find recipe html element to update error ");
        }
    });


    $('#choseEditElement').on('click', function () {
        let editRecipeIndex = $('#editSelect').val();
		//alert(editRecipeIndex);
        if (!$('#editForm').is(":visible")) {
            $('#editForm').toggle(1000);
            editedRecipeIndex = editRecipeIndex;
            let editedRecipe = getRecipeAtId(editRecipeIndex);
            $('#editName').val(editedRecipe.name);
            $('#editPrice').val(editedRecipe.price);
            $('#editCount').val(editedRecipe.count);

        }
    });

    function setRemoveOption(index) {
        let $editSelect = $('#removeSelect');
        let option = '<option >' + index + '</option>';
        $editSelect.append(option);
    }

    $('#choseRemoveElement').on('click', function () {
        let removeRecipeIndex = $('#removeSelect').val();
        let elementIdPhrase = 'recipe-' + removeRecipeIndex;
        ////
		let tdElements = document.getElementById(elementIdPhrase).getElementsByTagName("td");
		let tmp=tdElements[4].innerHTML.slice(0,4);
		//alert(tmp);
		let razem= $('#razem').text().split(/ +/);
           
		razem[0]-=tmp[0];
        console.log(razem);
         let sum=razem[0]+" "+razem[1];
            $('#razem').html(sum);
		
		////
		$("#" + elementIdPhrase).remove();
    });


    function getRecipeAtId(id) {
        for (let i = 0; i < recipesBase.length; i++) {
            if (recipesBase[i].id == id) {
                return recipesBase[i];
            }
        }
        console.log("Error recipe at ID " + id + " not exist in recipesBase[]");
    }


    $("#in").click(function () {
        //TODO add id field  fill;

        let recipe = {};
        recipe.id = getLastId();
        recipe.name = $('#name').val();
        recipe.count = $('#count').val();
        recipe.price = $('#price').val();
		
		if(recipe.count<0||recipe.price<0)
		{
			alert("Wartości podane są ujemne!");
			//recipe.count=Math.abs(recipe.count);
			//recipe.price=Math.abs(recipe.price);
		}

        if (!addNewReceipt(recipe)) {
            alert("error");
        } else {
        }

    });

    function getLastId() {
        if (recipesBase.length === 0) {
            return 0;
        }

        let tmp = recipesBase;
        let maxId = -1;
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].id > maxId) {
                maxId = tmp[i].id;
            }
        }
        return ++maxId;
    }


    function createRecipeTemplate(recipe) {
        var cena = (parseFloat(recipe.count) * recipe.price).toFixed(2);//dzialaja kropki
        let elementId = "recipe-" + recipe.id;
        var $row = ('<tr  id=' + elementId + '  >' +
            '<td class="lp">' + recipe.id + '</td>' +
            '<td class="nazwa">' + recipe.name + '</td>' +
            '<td>' + recipe.count + '</td>' +
            '<td>' + recipe.price + "zł" + '</td>' +
            '<td>' + cena + "zł" + '</td>' +
            '<td>' + '<div class="fa fa-level-up" onclick="moveUp(' + recipe.id + ')"></div>' + ' ' + '<div class="fa fa-level-down" onclick="moveDown(' + recipe.id + ')"></div>' + '</td>' +
            '</tr>');
        return $row;
    }


    function addNewReceipt(recipe) {

        recipesBase.push(recipe);
        setNewEditOption(recipe.id);
        setRemoveOption(recipe.id);



        recipe.price = recipe.price.replace(",", ".");
        recipe.count = recipe.count.replace(",", ".");




        recipesBase.push(recipe);

        if (!isNaN(parseFloat(recipe.count) * parseFloat(recipe.price))) {
            var $row = createRecipeTemplate(recipe);
            $('main tbody tr').eq('-1').before($row);

            let razem= $('#razem').text().split(/ +/);
            razem[0] = (parseFloat(razem[0].replace(',', '.')) + parseFloat(recipe.count) * parseFloat(recipe.price)).toFixed(2);

            console.log(razem);
            let sum=razem[0]+" "+razem[1];
            $('#razem').html(sum);

            let item = localStorage.getItem("recipes");
            if (item.length===0){
                console.log("AAAAAA");
            }
            console.log(item);
            item.push(recipe);
            localStorage.setItem("recipes",JSON.stringify(item));
            console.log(localStorage.getItem("recipes"));


            return true;
        }
        return false
    }

});