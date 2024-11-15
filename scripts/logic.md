#Notepad App (JS, HTML, CSS)#

1. Press ".btn-new-note" to that opens a popup (div element) tht allows user to input new information that will be used to create a note
2. This popup will have 2 textarea elements allowing the user to input the note's title and the contents of the note
3. The popup will also contain 2 buttons that are wrapped together at the bottom of the popup
4. 1 button to cancel the creation of the note & another button to save the note

------------------------------------------------------------------------

##Common Issues##
1. Class name is spelt wrong
2. Assigned a variable to an element that only appears in the DOM when it is created dynamically through another variables inner HTML that is set as apart of another function
3. CHECK THE BUMBACLART SPELLING OF CLASSES AND MAKE SURE THEY MATCH ALL ACROSS JS, CSS AND HTML FFS!!!!!!!!!!!!!!
4. Check if values are equal in terms of units (string, number, etc)
5. Use error logs mate.....
------------------------------------------------------------------------

##JS Logic##

1. When the new note button is pressed which activates the function responsible for creating the popup for a new note
    1.1. Variable declared for the new note button
    1.2. Event listener added to the new note button

2. A function is needed that will create the popup so that a new note can be created
    2.1. Variable is declared and assigned to the newly created div
    2.2. A class name for the new div is added to it
    2.3. The inner HTML of this div is stated
    2.4. The new div is appended onto the page (body)

3. Function that cancels (closes) the new note popup
    3.1. Variable declared and assigned to "popup__cancel-btn"
    3.2. Event listener added to new variable
    3.2. If statement to check if the popup exists before the removal happens on button click

4. Function to store the title and text of a new note
    4.1. Variable declared and assigned to the ".popup-container" class
    4.2. Variable declared and assigned to the "note-title" ID value
    4.3. Variable declared and assigned to the "note-content" ID value
    4.4. An IF statement is created that checks if the textarea box of the "popup__note-title" & "popup__note-content" elements are empty
    4.5. If they're both not empty 

---------------------------------------------------------------------------------
19:39pm

1. edit button opens the edit popup
2. delete note function needs to be made


    notesList.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-delete-note')) {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            //const noteObject = event.target.closest('.note');

            notes = notes.filter(note => note.id !== noteId);

            localStorage.setItem('notes', JSON.stringify(notes));

            showNotes();
        }
    })

    <div class="note__date">
                <time datetime="${note.creationDate}">${formattedDate}</time>
            </div>

            id: note.id, title: noteTitle, content: noteContent, creationDate: note.creationDate

            EVFEN DELEGATION: ADD EVENT LISTENER TO PARENT AND HAVE IT TRIGGER LISTENER EVENT TO TOGLEBTNOPTION HTML ELEMENT