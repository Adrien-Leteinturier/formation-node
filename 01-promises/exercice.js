import fs from 'node:fs/promises';

async function getUsers(ids) {
    return ids.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then((r) => r.json())
    );
}

async function getAndWriteUser() {
    try {
        const contenu = await fs.readFile("entree.json", "utf8");
        const ids = JSON.parse(contenu).ids;

        const users = await getUsers(ids);
        const utilisateurs = await Promise.all(users);

        await fs.writeFile(
            "sortie.json",
            JSON.stringify(utilisateurs, null, 2)
        );

        console.log("Terminé");
    } catch (err) {
        console.error("Erreur", err);
    }
}

getAndWriteUser()