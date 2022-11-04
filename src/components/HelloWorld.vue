<script setup>
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import DialogModal from './DialogModal.vue'

let etudiants = ref('')
let searched = ref(null)
let addButton = ref(false)
let showModal = ref(false)
let toBeDeletedId = ref(0)
let toBeDeletedName = ref('')
let toBeDeletedIndex = ref(0)
let searchResult = ref('')
let notFound = ref(false)
let spinner =ref(false)

const form = reactive({
  nom: null,
  age: null,
  filiere: null
})

var showUpdateDiv = ref(false)

const updateForm = reactive({
  id: null,
  nom: null,
  age: null,
  filiere: null
})

onMounted(() => {
  axios.get('http://localhost:8000/etudiants').then(res => etudiants.value = res.data)
})

const fireModal = (id, name, index) => {
  showModal.value = true
  toBeDeletedId.value = id
  toBeDeletedName.value = name
  toBeDeletedIndex.value = index

}
const closeModal = () => {
  showModal.value = false;

};

const submit = () => {
  addButton.value = true
  axios.post('http://localhost:8000/etudiants', form).then(res => console.log(res.data)).then(addButton.value = false)
    .catch(err => console.log(err))

  setTimeout(() => {
    axios.get('http://localhost:8000/etudiants').then((res) => {
      etudiants.value.push(res.data[(res.data.length) - 1])
    })
  }, 100);
  form.age = ''
  form.nom = ''
  form.filiere = ''
}

const update = () => {
  axios.put('http://localhost:8000/etudiants', updateForm).then(res => console.log(res.data))
    .catch(err => console.log(err))
  etudiants.value = ''
  setTimeout(() => {
    axios.get('http://localhost:8000/etudiants').then(res => etudiants.value = res.data).then(console.log('called the api'))
  }, 800);

}

const del = () => {
  axios.delete('http://localhost:8000/etudiant/' + toBeDeletedId.value).then(res => console.log(res.data))
    .catch(err => console.log(err))
  etudiants.value.splice(toBeDeletedIndex.value, 1)
  showModal.value = false;

}

const populateUpdateForm = (id, nom, age, filiere) => {
  showUpdateDiv.value = true

  updateForm.age = age
  updateForm.id = id
  updateForm.filiere = filiere
  updateForm.nom = nom
}

const search = () => {
  spinner.value=true
  setTimeout(() => {
    axios.get('http://localhost:8000/rechercher/' + searched.value).then(res => searchResult.value = res.data).then(() => {
      searchResult.value.length == 0 ? notFound.value = true : notFound.value = false
    })
      .catch(err => console.log(err))
      spinner.value=false
  }, 1000);

}


</script>


<template>
  <div class="bg-white text-xl mb-6 p-12 rounded-lg shadow-lg flex justify-between  px-12">
    <h1 class="font">Opérations CRUD avec MongoDB , Express et Vue</h1>
    <h1 class="font-bold">Raphael Doudou DIENE</h1>
  </div>

  <div class="p-12 bg-white shadow-lg flex justify-center rounded-lg">
    <div class="w-1/2 pr-9 ">
     <h4 class="font-bold">Liste des étudiants</h4>
      <ul class="w-full">

        <li class=" px-4 py-3 my-2 rounded-lg flex">
          <span class="text-sm text-gray-900 w-2/5 ">
            Nom
          </span>
          <span class="text-sm text-gray-500 w-1/5">
            Age
          </span>
          <span class="text-sm text-gray-500 w-1/5">
            Filière
          </span>
          <span class="w-1/5">

          </span>
          <span class="w-1/5">
          </span>

        </li>
        <li v-for="etudiant,index in etudiants" :key="etudiant._id"
          class="bg-gray-100 px-4 py-3 my-2 rounded-lg flex shadow-md">
          <span class="text-sm text-gray-900 w-2/5 font-bold">
            {{ etudiant.nom }}
          </span>
          <span class="text-sm text-gray-500 w-1/5">
            {{ etudiant.age }} ans
          </span>
          <span class="text-sm text-gray-500 w-1/5 text-center">
            {{ etudiant.filiere }}
          </span>
          <span class="w-1/5 mr-1">
            <a href="#modifier" class="px-4 py-1 text-sm text-amber-600 bg-amber-200 rounded-full font-bold "
              @click="populateUpdateForm(etudiant._id,etudiant.nom,etudiant.age,etudiant.filiere)">
              Modifier
            </a>
          </span>
          <span class="w-1/5">
            <button href="#" class="px-4 py-1 text-sm text-red-400 bg-red-200 rounded-full font-bold "
              @click.prevent="fireModal(etudiant._id,etudiant.nom,index)">
              Supprimer
            </button>
          </span>

        </li>
      </ul>



    </div>
    <form class="w-1/2" @submit.prevent="submit">
      <h5 class="mb-4 font-bold">Ajouter un étudiant</h5>
      <div class="relative font-bold mb-4">
        <label class="leading-7 text-sm text-gray-600">Prénom et nom</label>
        <input type="text"
          class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          v-model="form.nom" required>
      </div>
      <div class="relative font-bold mb-4">
        <label class="leading-7 text-sm text-gray-600">Age</label>
        <input type="text"
          class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          v-model="form.age" required>
      </div>
      <div class="relative font-bold mb-4">
        <label for="age" class="leading-7 text-sm text-gray-600">Filière</label>
        <select name="filiere" id="filiere" v-model="form.filiere" required
          class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out h-10">
          <option value="LGI">LGI</option>
          <option value="LMI">LMI</option>
          <option value="LPC">LPC</option>
          <option value="LSEE">LSEE</option>
        </select>
      </div>
      <button
      class="inline-flex items-center px-4 py-2 bg-green-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-900 active:bg-green-700 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-700 disabled:opacity-25 shadow-lg shadow-green-700/50 hover:shadow-none hover:scale-105 transition-all"
        type="submit">
        Ajouter
      </button>
    </form>
  </div>
    <div class="p-7 bg-white shadow-lg flex justify-center rounded-lg mt-7 gap-5" v-show="showUpdateDiv">
      <form class="w-1/2" @submit="update(updateForm.id)" id="modifier">
        <h5 class="mb-4 font-bold">Editer les informations sur l'étudiant</h5>
        <div class="relative font-bold mb-4">
          <label for="email" class="leading-7 text-sm text-gray-600">Prénom et nom</label>
          <input type="text" id="email" name="email"
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            v-model="updateForm.nom">
        </div>
        <div class="relative font-bold mb-4">
          <label for="age" class="leading-7 text-sm text-gray-600">Age</label>
          <input type="text" id="age" name="age"
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            v-model="updateForm.age">
        </div>
        <div class="relative font-bold mb-4">
          <label for="age" class="leading-7 text-sm text-gray-600">Filière</label>
          <select name="filiere" id="filiere" v-model="updateForm.filiere"
            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out h-10">
            <option value="LGI">LGI</option>
            <option value="LMI">LMI</option>
            <option value="LPC">LPC</option>
            <option value="LSEE">LSEE</option>
          </select>
        </div>
        <button
      class="inline-flex items-center px-4 py-2 bg-teal-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-teal-900 active:bg-teal-700 focus:outline-none focus:border-teal-700 focus:ring focus:ring-teal-700 disabled:opacity-25 shadow-lg shadow-green-700/50 hover:shadow-none hover:scale-105 transition-all"
        type="submit">
        Ajouter
      </button>
      </form>


    </div>


  <div class="p-7 bg-white shadow-lg flex justify-center rounded-lg mt-7 gap-5 rounded-lg flex flex-wrap">
    <form class="border-2 border-slate-200 p-4 rounded-lg m-auto" @submit.prevent="search">
      <div class="relative mb-4">
        <label for="name" class="leading-7 text-sm text-gray-600">Rechercher un étudiant</label>
        <input type="nom" id="name" name="name" required v-model="searched"
          class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out">
      </div>
      <button
      class="inline-flex items-center px-4 py-2 bg-blue-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-900 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-700 disabled:opacity-25 shadow-lg shadow-blue-700/50 hover:shadow-none hover:scale-105 transition-all"
        type="submit">
        Rechercher
      </button>
    </form>
   

    <div v-show="notFound">
      <h1 class="font-bold">Aucun etudiant trouvé </h1>
      <img src="../assets/nothinghere.webp">
    </div>

    <div class="w-full flex gap-5 px-44" v-if="searchResult.length">
      <div class="border-2 border-slate-200 p-4 rounded-lg whitespace-pre-wrap bg-black text-green-400">
        <h4>Réponse JSON du serveur :</h4>
        <pre>
          {{ searchResult }}
        </pre>
      </div>

      <div class="flex flex-wrap gap-3 content-center">
        <div class="flex h-32 border-2 border-slate-200 rounded-lg w-full" v-for="result in searchResult"
          :key="result.id">
          <div class="flex w-1/3">
            <img class="rounded-full w-16 h-16  m-auto" src="../assets/avatar.jpg" alt="Image" />
          </div>
          <div class="flex flex-wrap w-2/3 py-7 text-slate-400">
            <div class="w-full"><span class="bg-gray-200 px-2 py-1.5 h-7 font-bold rounded-lg">{{ result.nom }}</span>
            </div>
            <div class="w-full"><span class="bg-gray-200 px-2 py-1.5 h-7 font-bold rounded-lg">{{ result.age }}
                ans</span>
            </div>
            <div class="w-full"><span class="bg-gray-200 px-2 py-1.5 h-7 font-bold rounded-lg">{{ result.filiere
            }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="spinner" class="flex m-auto">
      <div style="border-top-color:transparent"
        class="w-16 h-16 border-4 border-red-400 border-solid rounded-full animate-spin"></div>
    </div>
  </div>

  <DialogModal :show="showModal" @close="closeModal">
    <template #title>
      Supprimer un etudiant
    </template>
    <template #content>
      Vous etes sur point de supprimer l'etudiant {{ toBeDeletedName }}
    </template>
    <template #footer>
      <button class="bg-gray-300 text-gray-500 px-4 py-1 rounded-md mr-2" @click="closeModal">
        Annuler
      </button>
      <button class="bg-red-500 px-4 py-1 rounded-md text-white" @click="del">
        Confirmer
      </button>
    </template>

  </DialogModal>
</template>




<style>
* {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style> 