import {Application, Router} from 'http://deno.land/x/oak/mod.ts';
import {addDog, getDog, getDogs, removeDog, updateDog} from "./Dogs.ts";

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
