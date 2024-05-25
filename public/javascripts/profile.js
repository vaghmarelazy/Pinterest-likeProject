

function openModal() {
  document.getElementById("upload-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("upload-modal").style.display = "none";
  location.reload();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Display the selected image in the modal
      const selectedImage = document.getElementById("selected-image");
      selectedImage.src = e.target.result;
      openModal();
    };
    reader.readAsDataURL(file);
  }
}

function confirmUpload() {
  const caption = document.getElementById("caption-input").value;
  // document.getElementById("upload-modal").style.display = "block";
  document.getElementById("caption").value = caption;
  if(caption ===""){
    document.getElementById("captionWarn").style.display = "block";
  } else{
    document.getElementById("upload-form").submit();
    document.getElementById("captionWarn").style.display = "none";

  }
}

document.getElementById("upload-btn").addEventListener("click", () => {
  document.getElementById("file-input").click();
  setInterval(() => {
    document.getElementById("upload-modal").style.display = "block";
  }, 2000);
});



function toggleOptionsMenu(postId) {
  const options = document.getElementById(`options_${postId}`);
  if (options.style.opacity === '0' || options.style.opacity === '') {
    options.style.opacity = '1';
  } else {
    options.style.opacity = '0';
  }
  console.log(options);
}

function showOptions(postId) {
  const optionsId = document.getElementById(`options_${postId}`).id;
  const allOptions = document.querySelectorAll(".options");
  allOptions.forEach((options) => {
    if (options.id !== optionsId) {
      options.style.opacity = '0';
    }
  });
}



//input new caption
function replaceWithInputField(postId, currentCaption) {
  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  const deleteButton = document.getElementById(`btn_${postId}`);

  // Hide the "Delete Post" button
  deleteButton.style.display = 'none';

  // Create an input field
  const inputField = document.createElement('input');
  inputField.setAttribute('type', 'text');
  inputField.setAttribute('value', currentCaption);

  // Replace the button with the input field
  button.parentNode.replaceChild(inputField, button);

  // Create the "Rename" button
  const renameButton = document.createElement('button');
  renameButton.setAttribute('id', `rename_${postId}`);
  renameButton.setAttribute('data-post-id', postId);
  renameButton.textContent = 'Rename';

  // Insert the "Rename" button after the input field
  inputField.parentNode.insertBefore(renameButton, inputField.nextSibling);

  // Create the "Confirm Rename" button
  const confirmRenameButton = document.createElement('button');
  confirmRenameButton.setAttribute('id', `confirmRename_${postId}`);
  confirmRenameButton.setAttribute('data-post-id', postId);
  confirmRenameButton.setAttribute('onclick', `updateCaption('${postId}', '${currentCaption}')`);
  confirmRenameButton.textContent = 'Confirm Rename';

  // Insert the "Confirm Rename" button after the "Rename" button
  renameButton.parentNode.insertBefore(confirmRenameButton, renameButton.nextSibling);

  // Hide "Rename" button
  renameButton.style.display = 'none';

  // Focus on the input field
  inputField.focus();

  // Add event listener to handle input field blur
  inputField.addEventListener('blur', function () {
    const updatedCaption = inputField.value;
    updateCaption(postId, updatedCaption);

    // Replace input field with original button
    inputField.parentNode.replaceChild(button, inputField);

    // Hide "Confirm Rename" button and show "Rename" button
    confirmRenameButton.style.display = 'none';
    // renameButton.style.display = 'inline-block';

    // Show the "Delete Post" button again
    deleteButton.style.display = 'inline-block';
  });
}


async function updateCaption(postId, newCaption) {
  try {
    const response = await fetch('/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: postId,
        newCaption: newCaption,
        action: 'update'
      })
    });
    location.reload();

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error updating caption:', error);
  }
}

//Delete pop-up button
async function deletePost(postId) {
  const deleteButton = document.getElementById(`btn_${postId}`);
  const deletePop = document.querySelector('.popup')
  const op = document.getElementById(`menu${postId}`);
  const yesBtn = document.getElementById('Yes')

  deletePop.style.display = "block";
  deletePop.style.zIndex = 999;
  op.style.display = "none";

  yesBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          postId: postId,
          action: 'delete' // Specify the action as 'delete' to indicate deletion
        })
      });
      location.reload();

      if (response.ok) {
        // Post deleted successfully
        console.log('Post deleted successfully');
        // Optionally, you can reload the page or update the UI
      } else {
        // Error deleting post
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  })
}


function closePopup(){
  document.querySelector('.popup').style.display = "none";
  document.getElementById("captionWarn").style.display = "none";

  // location.reload();

}



// If there are No post then 
window.addEventListener('DOMContentLoaded', whenPostAwailable());
function whenPostAwailable() {
  const postNums = document.getElementById("postnums").innerHTML;
  if (postNums == 0) {
    const postContainer = document.getElementById("noPostEle");
    postContainer.style.display = "block";
  }
}
// whenPostAwailable();


document.getElementById("upload-modal").addEventListener('click',()=>{
  console.log('clicked')
})