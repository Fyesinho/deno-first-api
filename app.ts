import {Application, Router} from 'http://deno.land/x/oak/mod.ts';

interface dog {
    name: string
    age: number
}

let dogs: Array<dog> = [
    {
        name: 'Bobby',
        age: 7
    },
    {
        name: 'Duke',
        age: 4
    }
]

export const getDogs = ({response}: { response: any }) => {
    response.body = dogs;
}

export const getDog = ({params, response}: { response: any, params: { name: string } }) => {
    const dog = dogs.filter(dog => dog.name === params.name);
    if (dog.length) {
        response.status = 200;
        response.body = dog[0];
        return;
    }
    response.status = 400;
    response.body = {
        msg: `No existe el dog con el name ${params.name}`
    }
}

export const addDog = async ({request, response}: { request: any, response: any }) => {
    const body = await request.body();
    const dog: dog = body.value;

    const dogExiste = dogs.filter(dogActual => dog.name === dogActual.name);
    if (dogExiste.length) {
        response.status = 400;
        response.body = {msg: `El dog ${dog.name} ya existe`}
        return;
    }
    dogs.push(dog);
    response.status = 200;
    response.body = {msg: `Se agregó ${dog.name} correctamente`}
}

export const updateDog = async ({request, response, params}: { request: any, response: any, params: { name: string } }) => {
    const body = await request.body();
    const dog: dog = body.value;

    const dogExist = dogs.filter(dogActual => params.name === dogActual.name);
    if (dogExist.length) {
        dogExist[0].age = dog.age;
        response.status = 200;
        response.body = {msg: `Se edito ${params.name} correctamente`}
        return;
    }

    response.status = 400;
    response.body = {msg: `El dog ${params.name} no existe`}
}

const removeDog = ({response, params}: { response: any, params: { name: string } }) => {
    const dogExist = dogs.filter(dogActual => params.name === dogActual.name);
    if (dogExist.length) {
        dogs = dogs.filter(dog => dog.name !== params.name);
        response.status = 200;
        response.body = {msg: `Se edito ${params.name} correctamente`}
        return;
    }

    response.status = 400;
    response.body = {msg: `El dog ${params.name} no existe`}
}

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || 'localhost';
const router = new Router();

router
    .get('/dogs', getDogs)
    .get('/dogs/:name', getDog)
    .post('/dogs/', addDog)
    .put('/dogs/:name', updateDog)
    .delete('/dogs/:name', removeDog)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Escuchando en el puerto ${PORT}`);

await app.listen(`${HOST}:${PORT}`)
