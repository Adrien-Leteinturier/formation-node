import fs from 'node:fs/promises';

async function getUsers(id) {
    const controller = new AbortController();
    const signal = controller.signal;

    const minuteur = setTimeout(() => controller.abort(), 2000);

    try {
       const reponse = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { signal })
        return reponse.json()
    } catch (err){
        if (err.name === 'AbortError') {
            throw new Error(`Fetch aborted for id ${id}`);
        }
        throw err;
    } finally {
        clearTimeout(minuteur);
    }
}

async function writeFile(source, data) {
   return await fs.writeFile(
        `${source}.json`,
        JSON.stringify(data, null, 2)
    );
}

async function getAndWriteUser() {
    try {
        const contenu = await fs.readFile("entree.json", "utf8");
        const ids = JSON.parse(contenu).ids;

        for (const id of ids) {
            const users = await getUsers(ids);
            const utilisateurs = await Promise.allSettled(users);

            const succes = utilisateurs
                .filter(r => r.status === "fulfilled")
                .map(r => r.value);

            const errors = utilisateurs.filter(r => r.status === "rejected")
                .map(r => r.value);

            await writeFile('sortie', succes);
            await writeFile('errors', errors);
        }

        console.log("Terminé");

    } catch (err) {
        await writeFile('errors', {
            message: err.message,
            stack: err.stack
        });
    }
}

getAndWriteUser()