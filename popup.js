document.addEventListener("DOMContentLoaded", () => {
  const changeTitleButton = document.getElementById("changeTitleButton");
  const resetTitleButton = document.getElementById("resetTitleButton");
  const titleInput = document.getElementById("titleInput");

  if (changeTitleButton) {
    changeTitleButton.addEventListener("click", () => {
      const newTitle = titleInput.value;
      if (newTitle.trim() !== "") {
        // Check if input is not empty
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          const tabId = tabs[0].id;
          chrome.scripting.executeScript(
            {
              target: { tabId },
              func: title => {
                if (!document.body.dataset.ogTitle) {
                  document.body.dataset.ogTitle = document.title; // Save the current title
                }
                document.title = title;
              },
              args: [newTitle],
            },
            () => {
              window.close(); // Close the popup after changing the title
            }
          );
        });
      }
    });
  }

  if (titleInput) {
    titleInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        changeTitleButton.click(); // Trigger the click event on Enter key
      }
    });
  }

  if (resetTitleButton) {
    resetTitleButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tabId = tabs[0].id;
        chrome.scripting.executeScript(
          {
            target: { tabId },
            func: () => {
              const originalTitle = document.body.dataset.ogTitle || "New Tab"; // Use saved title or default
              document.title = originalTitle;
            },
          },
          () => {
            window.close(); // Close the popup after resetting the title
          }
        );
      });
    });
  }
});
