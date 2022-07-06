async function main() {

    //retrieve list of books
    let bookRequest = await fetch("http://localhost:3001/listBooks");
    let books = await bookRequest.json();

    //create list of all books and create functionality for each
    const booksUL = document.createElement("ul");
    books.forEach((book) => {
        const bookLI = document.createElement("li");
        let bookDiv = createDivs(book);
        bookLI.append(bookDiv);
        booksUL.append(bookLI);
    });
    document.body.append(booksUL);

    //create form
    createForm();

}

//function to create functionality for each book
function createDivs(book) {

    //create html elements
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    //style
    div.classList = "mt-2"
    label.classList = "mx-1"
    input.classList = "mx-1"
    saveButton.classList = "mx-1 btn btn-primary btn-sm"
    deleteButton.classList = "mx-1 btn btn-danger btn-sm"

    //html properties
    label.textContent = book.title;
    saveButton.textContent = "Save";
    deleteButton.textContent = "Delete";
    input.type = "number";

    //update book quantity
    saveButton.addEventListener("click", async function() {
        await fetch("http://localhost:3001/updateBook", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: book.id,
                quantity: input.value
            })
        });
    });

    //delete button
    deleteButton.addEventListener("click", async function() {
        await fetch(`http://localhost:3001/removeBook/${book.id}`, {
            method: "DELETE"
        });
        document.location.reload();
    });

    //append all elements to div and return
    div.append(label, input, saveButton, deleteButton);
    return div;

}

//create form
function createForm() {
    const mainDiv = document.createElement("div");
    const header = document.createElement("h1");
    header.textContent = "Create Book";
    header.classList = "mx-2";
    mainDiv.append(header);
    document.body.append(mainDiv);

    //create labels and inputs for each field
    const formElements = ["title", "description", "image url"];
    formElements.forEach((element) => {
        //create each element
        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");

        //style
        div.classList = "mt-2"
        label.classList = "mx-1"
        input.classList = "mx-1"
        input.id = element;
        label.textContent = element.toUpperCase();

        //append to main div
        div.append(label, input);
        mainDiv.append(div);
    })

    //get inputs
    const titleInput = document.getElementById("title")
    const descriptionInput = document.getElementById("description")
    const urlInput = document.getElementById("image url")
    urlInput.pattern = "url";

    //create submit button
    const submitButton = document.createElement("submit");
    submitButton.textContent = "Submit";
    submitButton.classList = "mx-1 btn btn-primary"

    //submit button functionality
    submitButton.addEventListener("click", async function() {
        
        //check for empty fields
        if (!titleInput.value || !descriptionInput.value || !urlInput.value) {
            alert("One of the fields is empty.");
            return;
        }

        //add book to database
        await fetch("http://localhost:3001/addBook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleInput.value,
                year: new Date().getFullYear(),
                description: descriptionInput.value,
                quantity: 1,
                imageURL: urlInput.value
            })
        });

        document.location.reload();

    })

    mainDiv.append(submitButton);    

}

main();