function validatePassword(event) {
    const p1 = document.querySelector('#pass1');
    const p2 = document.querySelector('#pass2');

    if (p1.value == p2.value) {
        // je to OK
        p1.parentNode.parentNode.classList.remove('error');
        p2.parentNode.parentNode.classList.remove('error');
    } else {
        // je to KO
        event.preventDefault(); // poslani rq
        // a zobrazeni infa zda je jmeno pouzitelneault();
        p1.parentNode.parentNode.classList.add('error');
        p2.parentNode.parentNode.classList.add('error');
    }
}

function initForm() {
    const form = document.querySelector('body form');
    form.addEventListener('submit', validatePassword);

    document.querySelector('input[name="name"]').addEventListener("keyup", async (event) => {
        try {
            const response = await fetch("https://zwa.toad.cz/~vlachzd1/07/names.php", {
                method: "POST",
                body: 'name=' + encodeURIComponent(event.target.value),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const result = await response.blob().then((result) => result.text());
            if (result == "pouzito")  {
                event.target.parentNode.classList.add("error");
            } else {
                event.target.parentNode.classList.remove("error");
            }
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
    });
}
