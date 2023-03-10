import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, serverTimestamp, getCountFromServer, onSnapshot, orderBy, writeBatch, doc, deleteDoc, connectFirestoreEmulator, query, where, setDoc, runTransaction } from "firebase/firestore";
import emailjs from '@emailjs/browser';
import { read, writeFileXLSX } from "xlsx";
import XLSX from 'xlsx';
import axios from 'axios';
import Mailjet from 'node-mailjet';
import { base64 } from "@firebase/util";

const firebaseConfig = {
  apiKey: "AIzaSyD-yeq21RPZFZIYhecLaTh1OPkCuM0Z2ms",
  authDomain: "jackleckerman-70b9f.firebaseapp.com",
  projectId: "jackleckerman-70b9f",
  storageBucket: "jackleckerman-70b9f.appspot.com",
  messagingSenderId: "1070046232390",
  appId: "1:1070046232390:web:f52b183eb70fcad3a92f47",
  measurementId: "G-ZW770153Y5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let form = document.querySelector("#form");
let fname = document.querySelector('#fsname');
let lname = document.querySelector('#scname');
let email = document.querySelector('#email');
let coordBtn = document.querySelector('#add-coord-btn');
let errorOne = document.querySelector('#error-one');
let errorTwo = document.querySelector('#error-two');
let errorThree = document.querySelector('#error-three');

// Password Generator: 

function makepassword(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
// /////////////////////

let userEventId = sessionStorage.getItem("event ID");

if (coordBtn) {
  coordBtn.addEventListener('click', async (e) => {


  if (fname.value === '' || fname.value === null ||lname.value === '' || lname.value === null || email.value === '' || email.value === null) {
    if (fname.value === '' || fname.value === null) {

      errorOne.innerHTML = "*First name is required"
    } else {
      errorOne.classList.add("hidden")
    }
  
    if (lname.value === '' || lname.value === null) {
  
      errorTwo.innerHTML = "*Last name is required"
    } else {
      errorTwo.classList.add("hidden")
    }
  
    if (email.value === '' || email.value === null) {
  
      errorThree.innerHTML = "*Email is required"
    } else {
      errorThree.classList.add("hidden")
    }
  } else {
    regPop.classList.add("hidden");
    regPop.classList.remove("block");
    overlay.classList.add("hidden");

    let pass = [];
    pass.push(makepassword(10));

      var params = {
        from_name : `${fname.value} ${lname.value}`,
        email_id: email.value,
        password: pass.toString()
      }
      emailjs.send('service_p8wkknm', 'template_n8eujco', params, "F_Io2W4ApCRvQJTbo")
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
          console.log('FAILED...', error);
        });

      //MailJet:
      
      /**
 *
 * Run:
 *
 */
 
 /**
 *
 * This call sends a message to one recipient.
 *
 */

// console.log('fetching...')
// const data = JSON.stringify({
//   "Messages": [
//     {
//       "From": {
//         "Email": "klaudia.jackleckerman@gmail.com",
//         "Name": "Jackleckerman"
//       },
//       "To": [
//         {
//           "Email": email.value,
//           "Name": fname.value + lname.value,
//           // "password": pass.toString(),
//         }
//       ],
//       "Subject": "Jackleckerman test email!",
//       "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
//       "HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
//     }
//   ]
// });

// const xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener("readystatechange", function () {
//   if (this.readyState === this.DONE) {
//     console.log(this.responseText);
//   }
// });

// xhr.open("POST", "https://api.mailjet.com/v3.1/send");
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.setRequestHeader("Authorization", "Basic YmI5OGNhM2RmOGE3MDYxNWU3NjlhMGZkZjEyYWRjNDE6YzhiMzFiNWZjOGVkYzZjY2RmMDUzYmVhOTljNmQ5NWU=");

// xhr.send(data);
// const mailjet = Mailjet.apiConnect(
//   'bb98ca3df8a70615e769a0fdf12adc41',
//   'c8b31b5fc8edc6ccdf053bea99c6d95e'
// );
// const request = mailjet
// 	.post("send", {'version': 'v3.1'})
// 	.request({
// 		"Messages":[
// 				{
// 						"From": {
// 								"Email": "klaudia.jackleckerman@gmail.com",
// 								"Name": "Jackleckerman"
// 						},
// 						"To": [
// 								{
// 										"Email": 'ell@petaniweb.com',
// 										"Name": 'Ilyas'
// 								}
// 						],
// 						"Subject": "Jackleckerman email test!",
// 						"TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
// 						"HTMLPart": "<h3>Dear passenger 1, welcome to <a href=\"https://www.mailjet.com/\">Mailjet</a>!</h3><br />May the delivery force be with you!"
// 				}
// 		]
// 	})
// request
// 	.then((result) => {
// 		console.log(result.body)
// 	})
// 	.catch((err) => {
// 		console.log(err.statusCode)
// 	})

      // const myModule = require('node-mailjet');

      // if (myModule) {
      //   console.log('Module imported successfully');
      // } else {
      //   console.log('Module not found');
      // }


      // const Mailjet = require('node-mailjet');

      // const mailjet = Mailjet.apiConnect(
      //   process.env.MJ_APIKEY_PUBLIC,
      //   process.env.MJ_APIKEY_PRIVATE,
      // );
      
      // function sendEmail(recipient) {
      //   return mailjet
      //     .post("send", { version: "v3.1" })
      //     .request({
      //       Messages: [
      //         {
      //           From: {
      //             Email: "shady22elmagic@gmail.com",
      //             Name: "JackLeckerman",
      //           },
      //           To: [
      //             {
      //               Email: email.value,
      //             },
      //           ],
      //           Subject: "one",
      //           TextPart: "two",
      //           HTMLPart: "three",
      //         },
      //       ],
      //     })
      //     .then((result) => {
      //       // do something with the send result or ignore
      //       console.log("done")
      //     })
      //     .catch((err) => {
      //       // handle an error
      //       console.log("error")
      //     });
      // }

      // const api = new MailSlurp({ apiKey: "db682089d96bec6fbce322f0ff2467b9e1ef6f639d663eb4a6de00332dbe2c2c" });
      // const newEmailInbox = await api.createInbox();
      // const result = await sendEmail(newEmailInbox.emailAddress);
      // expect(result.success).to.be(true);

      // **************
      
    try {
      const docRef = await addDoc(collection(db, "excelSheetMembers"), {
        firstName: fname.value,
        lastName: lname.value,
        email: email.value,
        password: pass.toString(),
        changedPassword: false,
        rank: 1
      });

      // let coordRef = doc(db, "Events", userEventId, "users", docRef.id);
      // setDoc(coordRef, {
      //   name: fname.value,
      //   lastName: lname.value,
      //   isAdmin: true
      // });

      alert("Coordinator Added Successfully")
      location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});
}





// Events : 

let eventBtn = document.querySelector("#add-event-btn");
let eventName = document.querySelector("#eventname");
let eventSelectColor = document.querySelector("#select-event-color");
let eventPop = document.querySelector("#event-pop");
let overlay = document.querySelector(".overlay");

let eventErrorOne = document.querySelector("#event-error-one")
let eventErrorTwo = document.querySelector("#event-error-two")

if (eventBtn) {
  eventBtn.addEventListener('click', async (e) => {


  if (eventName.value === '' || eventName.value === null || eventSelectColor.value === '#000000') {
    if (eventName.value === '' || eventName.value === null) {

      eventErrorOne.innerHTML = "*Event name is required"
    } else {
      eventErrorOne.classList.add("hidden")
    }
  
    if (eventSelectColor.value === '#000000' || '#003366' || '#008dff' || '#FFFFFF' || '#fff0') {
  
      eventErrorTwo.innerHTML = "*Select Another Color"
    } else {
      eventErrorTwo.classList.add("hidden")
    }
  } else {
    eventPop.classList.add("hidden");
    eventPop.classList.remove("block");
    overlay.classList.add("hidden");

    try {
      let userID = sessionStorage.getItem("User ID");
      const docRef = await addDoc(collection(db, "Events"), {
        eventName: eventName.value,
        eventcolor: eventSelectColor.value,
        eventOwnerID: userID
      });

      var userEventId = sessionStorage.getItem("event ID");
      var userEventName = sessionStorage.getItem("UserName");

        const userRef = doc(db, "Events", docRef.id, "users", userID);
        setDoc(userRef, {
          name: userEventName || null,
          rank: 1
        });


      alert("Event Added Successfully")
      location.reload();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});
}


const querySnapshot = await getDocs(collection(db, "excelSheetMembers"));
querySnapshot.forEach((doc) => {

  if (doc.data().rank != 2) {

    // List for Coordinators Page
    let listContainer = document.querySelector("#list-container");
  
    if (listContainer) {
      let listBlock = document.createElement("div");
  
    listBlock.innerHTML = `
    <a class="rounded-xl w-full grid grid-cols-12 bg-grey text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform" href="#">
                      
    <!-- Icon -->
    <div class="col-span-12 md:col-span-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    </div>
    
    <!-- Title -->
    <div class="col-span-11 xl: ml-6">
      <p class="text-blue-600 font-semibold"> ${doc.data().firstName} ${doc.data().lastName} </p>
    </div>
    
    <!-- Description -->
    <div class="md:col-start-2 col-span-11 xl: ml-6">
      <p class="text-sm text-gray-800 font-light"> ${doc.data().email} </p>
    </div>
    
  </a>
    `;
  
    listContainer.appendChild(listBlock);
    }
  }

  
});

var adminID = sessionStorage.getItem("User ID");
const qx = query(collection(db, "Events"), where("eventOwnerID", "==", adminID));

const querySnapshots = await getDocs(qx);
querySnapshots.forEach((doctwo) => {



  // List for Events Page
  let eventContainer = document.querySelector("#event-container");

  if (eventContainer) {

    let eventBlock = document.createElement("div");

    eventBlock.setAttribute('id', `${doctwo.id}`);

    eventBlock.innerHTML = `
    <div class="up-click rounded-xl w-full grid grid-cols-12  text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform"style="background-color: ${doctwo.data().eventcolor};" href="#">
                      
      <!-- Icon -->
      <div class="col-span-12 md:col-span-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      </div>

      <!-- Title -->
      <div class="col-span-11 xl: ml-6">
        <p class="font-semibold"> ${doctwo.data().eventName} </p>
      </div>

      
      <button id=${doctwo.id}-excel class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Add users with excel sheet</button>
      <button id=${doctwo.id}-adduser class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Add users manually</button>
      <button id=${doctwo.id}-edit class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Edit / Delete Event</button>
      <button id=${doctwo.id}-option class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Options</button>
      
      </div>
      `;
      
      // <!-- Description -->
      // <div class="md:col-start-2 col-span-11 xl: ml-6">
      //   <p class="text-sm text-gray-800 font-light"> ${doctwo.data().eventcolor} </p>
      // </div>

    eventContainer.appendChild(eventBlock);
    
    let uploadExcel = document.querySelector(`#${doctwo.id}-excel`);
    if (uploadExcel) {
        uploadExcel.addEventListener('click', () => {

        let excelPop = document.querySelector("#excel-pop");
        if(excelPop) {
        let eventPopUp = document.createElement("div");
        eventPopUp.setAttribute('class', `${doctwo.id}`);

        eventPopUp.innerHTML = `
        <div id="excel-pop-hidden" class="hidden items-center justify-center relative">
          <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">
                    <svg class="text-blue w-24 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <div class="input_field flex flex-col w-max mx-auto text-center">
                        <label>
                            <input id="upld" class="text-sm cursor-pointer w-36 hidden" type="file"/>
                            <div class="text bg-darkblue text-white border rounded font-semibold cursor-pointer p-1 px-3 hover:bg-blue">Select</div>
                        </label>
        
                        <div class="title text-darkblue uppercase">or drop files here</div>
                    </div>
                    <button type="button" id="close-excel" class="text-white scale-75 bg-darkblue hover:bg-blue focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-auto mt-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Close</button>
                </div>
            </div>
          </div>
        </div>
        `
        excelPop.appendChild(eventPopUp);

        let popHidden = document.querySelector("#excel-pop-hidden");
        popHidden.classList.add("flex");
        popHidden.classList.remove("hidden");

        let closeExcel = document.querySelector("#close-excel");
        if (closeExcel) {
          closeExcel.addEventListener('click',() => {
            popHidden.classList.add("hidden");
            popHidden.classList.remove("flex");
          });
        }

      // **********************

      let upldBtn = document.querySelector("#upld");

      if (upldBtn) {
        upldBtn.addEventListener('change', function handleFile(e) {
          var files = e.target.files, f = files[0];
          var reader = new FileReader();
          reader.onload = async function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var rows = XLSX.utils.sheet_to_json(worksheet, {header:1});

            for (let i = 0; i < rows.length -1 ; i++) {

              let pass = [];
              pass.push(makepassword(10));


              let eventIds = [];
              eventIds.push(eventPopUp.getAttribute("class"));
              
              

              try {

                const usersRef = collection(db, "excelSheetMembers");
                                                                        
                const notFoundQuery = query(usersRef);
                const notFoundQuerySnapShot = await getDocs(notFoundQuery);

                let found = false
                notFoundQuerySnapShot.forEach((document) => {
                if(document.data().email == rows[i][2]) {
                  found = true
                }
                  
                });


                if(!found) {
                    const reff = await addDoc(collection(db, "excelSheetMembers"), {
                    Name: rows[i][0] || null,
                    Surname: rows[i][1] || null,
                    email: rows[i][2] || null,
                    jobTitle: rows[i][3] || null,
                    Company: rows[i][4] || null,
                    Country: rows[i][5] || null,
                    Password: pass.toString() || null,
                    eventId: eventIds || null,
                    changedPassword: false,
                    rank: 2
                  });

                  var userEventId = sessionStorage.getItem("event ID");
                  console.log(reff.id)

                  let chatRef = doc(db, "Events", userEventId, "users", reff.id);
                  setDoc(chatRef, {
                    name: rows[i][0] || null,
                    surname: rows[i][1] || null,
                    rank: 2
                  });
                }


                const foundQuery = query(usersRef, where("email", "==", rows[i][2]));
                const foundQuerySnapShot = await getDocs(foundQuery);

                foundQuerySnapShot.forEach(async (document) => {
          

                  let eventList = document.data().eventId
                  let eventArr = Array.from(eventList);


                  if (!eventArr.includes(eventIds.toString())) {
                    console.log("yes")
                    
                    eventArr.push(eventIds.toString())

                    try {
                      
                      const washingtonRef = doc(db, "excelSheetMembers", document.id);

                      // Set the "capital" field of the city 'DC'
                      await updateDoc(washingtonRef, {
                        eventId: eventArr
                      });
                      
                      console.log("Success");
                    } catch (e) {
                      // This will be a "population is too big" error.
                      console.error(e);
                    }

                  } else {
                    console.log("no")
                  }
                });

                console.log("DONE")
              } catch (e) {
                console.error("Error adding document: ", e);
              }

            } 

          };
          reader.readAsBinaryString(f);
        })
      }

      // **********************

    }

      })
    }

    // -----------------------------
    
    let uploadUser = document.querySelector(`#${doctwo.id}-adduser`);
    if (uploadUser) {
        uploadUser.addEventListener('click', () => {
          sessionStorage.setItem("event ID", `${doctwo.id}`);
        let addPop = document.querySelector("#add-user");
        if(addPop) {
        let addUserPopUp = document.createElement("div");
        addUserPopUp.setAttribute('class', `${doctwo.id}`);
        
        
        addUserPopUp.innerHTML = `
        
        <div id="add-user-pop" class="hidden items-center justify-center absolute top-[5rem]">
          <div class=" flex sticky z-10 top-0 w-full h-full bg-black bg-opacity-60">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">
                    
                <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input autocomplete="off" required id="name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Name" />
                    <label for="name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Name</label>
                  </div>

                  <div id="user-error-one"></div>
                  
                  <div class="relative">
                    <input autocomplete="off" required id="surname" name="surname" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Surname" />
                    <label for="surname" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Surname</label>
                  </div>

                  <div id="user-error-two"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="user-email" name="email" type="email" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Email address" />
                    <label for="user-email" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email Address</label>
                  </div>

                  <div id="user-error-three"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="job-title" name="Jobtitle" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Job Title" />
                    <label for="job-title" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Job Title</label>
                  </div>

                  <div id="user-error-four"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="company" name="company" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Company" />
                    <label for="company" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Company</label>
                  </div>

                  <div id="user-error-five"></div>

                  <div class="relative">
                    <input autocomplete="off" required id="country" name="country" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="country" />
                    <label for="country" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">country</label>
                  </div>

                  <div id="user-error-six"></div>

                  <div class="relative">
                    <button id="add-user-btn" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">Add</button>
                    <button id="close-user-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                  </div>
                </div>

                </div>
            </div>
          </div>
        </div>

        

        `
        addPop.appendChild(addUserPopUp);

        let overlay = document.querySelector(".overlay");
        let addpopHidden = document.querySelector("#add-user-pop");
        addpopHidden.classList.add("flex");
        addpopHidden.classList.remove("hidden");
        overlay.classList.remove("hidden");

        let closeExcel = document.querySelector("#close-user-btn");
        if (closeExcel) {
          closeExcel.addEventListener('click',() => {
            addpopHidden.classList.add("hidden");
            addpopHidden.classList.remove("flex");
            overlay.classList.add("hidden");
          });
        }

        let upldBtn = document.querySelector("#add-user-btn");

        if (upldBtn) {
          upldBtn.addEventListener('click', async() => {
                

                let username = document.querySelector("#name");
                let surname = document.querySelector("#surname");
                let userEmail = document.querySelector("#user-email");
                let jobtitle = document.querySelector("#job-title");
                let company = document.querySelector("#company");
                let country = document.querySelector("#country");
                
                
                let userErrorOne = document.querySelector("#user-error-one");
                let userErrorTwo = document.querySelector("#user-error-two");
                let userErrorThree = document.querySelector("#user-error-three");
                let userErrorFour = document.querySelector("#user-error-four");
                let userErrorFive = document.querySelector("#user-error-five");
                let userErrorSix = document.querySelector("#user-error-six");
                


                let pass = [];
                pass.push(makepassword(10));
  
  
                let eventIds = [];
                eventIds.push(addUserPopUp.getAttribute("class"));
                
                
                if (username.value === '' || username.value === null ||surname.value === '' || surname.value === null || userEmail.value === '' || userEmail.value === null || jobtitle.value === '' || jobtitle.value === null || company.value === '' || company.value === null || country.value === '' || country.value === null) {
                  if (username.value === '' || username.value === null) {
              
                    userErrorOne.innerHTML = "*Name is required"
                  } else {
                    userErrorOne.classList.add("hidden")
                  }
                
                  if (surname.value === '' || surname.value === null) {
                
                    userErrorTwo.innerHTML = "*Surname is required"
                  } else {
                    userErrorTwo.classList.add("hidden")
                  }
                
                  if (userEmail.value === '' || userEmail.value === null) {
                
                    userErrorThree.innerHTML = "*Email Address is required"
                  } else {
                    userErrorThree.classList.add("hidden")
                  }

                  if (jobtitle.value === '' || jobtitle.value === null) {
                
                    userErrorFour.innerHTML = "*Email Address is required"
                  } else {
                    userErrorFour.classList.add("hidden")
                  }

                  if (company.value === '' || company.value === null) {
                
                    userErrorFive.innerHTML = "*Email Address is required"
                  } else {
                    userErrorFive.classList.add("hidden")
                  }

                  if (country.value === '' || country.value === null) {
                
                    userErrorSix.innerHTML = "*Email Address is required"
                  } else {
                    userErrorSix.classList.add("hidden")
                  }
                } else {
                  try {
  
                    const usersRef = collection(db, "excelSheetMembers");
                                                                            
                    const notFoundQuery = query(usersRef);
                    const notFoundQuerySnapShot = await getDocs(notFoundQuery);
    
                    let found = false
                    notFoundQuerySnapShot.forEach((document) => {
                    if(document.data().email == userEmail.value) {
                      found = true
                    }
                      
                    });
    
    
                    if(!found) {
                        const reff = await addDoc(collection(db, "excelSheetMembers"), {
                        Name: username.value,
                        Surname: surname.value,
                        email: userEmail.value,
                        jobTitle: jobtitle.value,
                        Company: company.value,
                        Country: country.value,
                        Password: pass.toString() || null,
                        eventId: eventIds || null,
                        changedPassword: false,
                        rank: 2
                      });
                        var userEventId = sessionStorage.getItem("event ID");
                        console.log(reff.id)

                        let chatRef = doc(db, "Events", userEventId, "users", reff.id);
                        setDoc(chatRef, {
                          name: username.value,
                          surname: surname.value,
                          rank: 2
                        });
                    
                    }
    
    
                    const foundQuery = query(usersRef, where("email", "==", userEmail.value));
                    const foundQuerySnapShot = await getDocs(foundQuery);
    
                    foundQuerySnapShot.forEach(async (document) => {
              
    
                      let eventList = document.data().eventId
                      let eventArr = Array.from(eventList);
    
    
                      if (!eventArr.includes(eventIds.toString())) {
                        console.log("yes")
                        
                        eventArr.push(eventIds.toString())
    
                        try {
                          
                          const washingtonRef = doc(db, "excelSheetMembers", document.id);
    
                          // Set the "capital" field of the city 'DC'
                          await updateDoc(washingtonRef, {
                            eventId: eventArr
                          });
                          
                          console.log("Success");
                        } catch (e) {
                          // This will be a "population is too big" error.
                          console.error(e);
                        }
    
                      } else {
                        console.log("no")
                      }
                    });
    
                    
                    alert("User Added Successfully")
                    location.reload();
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  } 
                }
          })
        }


      }
    })
    }

  }
});



const querySnapshotss = await getDocs(collection(db, "excelSheetMembers"));
querySnapshotss.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots

  let emailInput = document.querySelector("#email");
  let passInput = document.querySelector("#password");
  let logBtn = document.querySelector("#login-btn");
  
  let emailError = document.querySelector("#email-error");
  let passError = document.querySelector("#pass-error");


  if (logBtn) {
    logBtn.addEventListener('click', () => {
      if (emailInput.value != doc.data().email || passInput.value != doc.data().password) {
        
        if (emailInput.value != doc.data().email) {
          emailError.innerHTML = "*Email Address is incorrect"
        } else {
          emailError.classList.add("hidden")
        }

        if (passInput.value != doc.data().password) {
          passError.innerHTML = "*Password is incorrect"
        } else {
          passError.classList.add("hidden")
        }

      } else {
        sessionStorage.setItem("User ID", doc.id);
        sessionStorage.setItem("UserName", `${doc.data().firstName} ${doc.data().lastName}`);
        sessionStorage.setItem("isLogged", `True`);
        
        window.location.href = `events.html`;

      }
    } )
  }

});


const querySnapshotsx = await getDocs(collection(db, "Events"));
querySnapshotsx.forEach((doccc) => {
  // doc.data() is never undefined for query doc snapshots

  let editBtn = document.querySelector(`#${doccc.id}-edit`)

  if (editBtn) {
    editBtn.addEventListener('click', () => {

      let editPop = document.querySelector("#edit-event");
        if(editPop) {
        let editEventPopUp = document.createElement("div");
        editEventPopUp.setAttribute('class', `${doccc.id}`);

        editEventPopUp.innerHTML = `
        
        <div id="edit-event-pop" class="hidden items-center justify-center relative">
          <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
            <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">

                <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div class="relative">
                    <input autocomplete="off" required id="edit-event-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Event Name" />
                    <label for="edit-event-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Event Name</label>
                  </div>

                  <div id="edit-error-one"></div>

                  <div class="relative" id="mrg">
                    <label for="edit-event-color" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Add Event Color:</label>
                    <input type="color" name="colors" id="edit-event-color" class="mt-4 border-black" value="#000000">
                  </div>
                  

                  <div id="edit-error-two"></div>

                  <div class="relative">
                    <button id="edit-event-btn" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">Edit</button>
                    <button id="delete-event-btn" class="bg-red hover:bg-blue text-white rounded-md px-2 py-1">Delete</button>
                    <button id="close-event-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                  </div>
                </div>

                </div>
            </div>
          </div>
        </div>
        `
        editPop.appendChild(editEventPopUp);

        let overlay = document.querySelector(".overlay");
        let editpopHidden = document.querySelector("#edit-event-pop");
        editpopHidden.classList.add("flex");
        editpopHidden.classList.remove("hidden");
        overlay.classList.remove("hidden");

        let closeEventPop = document.querySelector("#close-event-btn");
        if (closeEventPop) {
          closeEventPop.addEventListener('click',() => {
            editpopHidden.classList.add("hidden");
            editpopHidden.classList.remove("flex");
            overlay.classList.add("hidden");
          });
        }

        let deleteEvent = document.querySelector("#delete-event-btn");
        if (deleteEvent) {
          deleteEvent.addEventListener('click', async () => {
            let eventID = editEventPopUp.getAttribute('class');
            

            editpopHidden.classList.add("hidden");
            editpopHidden.classList.remove("flex");
            overlay.classList.add("hidden");

            if (window.confirm("Do you really want to delete this event?")) {
              try {
                await deleteDoc(doc(db, "Events", eventID))
                alert("Event Deleted")
                location.reload();
              } catch (e){
                console.log(e)
              }
            }
          });
        }

        let editEvent = document.querySelector("#edit-event-btn");
        if (editEvent) {
          editEvent.addEventListener('click', async () => {

            let editErrorOne = document.querySelector("#edit-error-one");
            let editErrorTwo = document.querySelector("#edit-error-two");

            let editEventName = document.querySelector("#edit-event-name");
            let editEventColor = document.querySelector("#edit-event-color");

            if (editEventName.value === '' || editEventName.value === null || editEventColor.value === '#000000') {
              if (editEventName.value === '' || editEventName.value === null) {
          
                editErrorOne.innerHTML = "*Event name is required"
              } else {
                editErrorOne.classList.add("hidden")
              }
            
              if (editEventColor.value === '#000000' || '#003366' || '#008dff' || '#FFFFFF' || '#fff0') {
            
                editErrorTwo.innerHTML = "*Select Another Color"
              } else {
                editErrorTwo.classList.add("hidden")
              }
            } else {
              let eventID = editEventPopUp.getAttribute('class');

              try {

                const eventRef = doc(db, "Events", eventID);
                await updateDoc(eventRef, {
                  eventName: editEventName.value,
                  eventcolor: editEventColor.value
                });
                alert("Event Edited")
                location.reload();

              } catch(e) {
                console.log(e)
              }

            }
          });

        }
      }
    });
  }

});

const querySnapshott = await getDocs(collection(db, "Events"));
querySnapshott.forEach(async(doccc) => {
  // doc.data() is never undefined for query doc snapshots

  let optBtn = document.querySelector(`#${doccc.id}-option`)

  if (optBtn) {
    optBtn.addEventListener('click', async () => {

      let optPop = document.querySelector("#option-pop");
      
        if (optPop) {
        let optionPopUp = document.createElement("div");
        optionPopUp.setAttribute('class', `${doccc.id}`);
        let ids = optionPopUp.getAttribute('class')
        sessionStorage.setItem("event ID", ids);

        optionPopUp.innerHTML = `
        
        <div id="opt-event-pop" class="hidden items-center justify-center relative">
        <div  class=" flex fixed z-10 top-0 w-full h-full bg-navy bg-opacity-60 flex-col items-center ">
        <div  class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg grid gap-[1rem] grid-cols-4">
                
              <div id=${doccc.id}-attend>
                <a href="attendees.html" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border border-navy rounded-lg shadow hover:bg-black">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">Attendees</h5>
                </a>
              </div>
              
              <div id=${doccc.id}-poll>
                <a href="polls.html" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border border-navy rounded-lg shadow hover:bg-black">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">Polls</h5>
                </a>
              </div>

              <div id=${doccc.id}-chat>
                <a href="chat.html" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border border-navy rounded-lg shadow hover:bg-black">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">Chat</h5>
                </a>
              </div>

              <div id=${doccc.id}-add-opt>
                <a href="#" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-green border border-green rounded-lg shadow hover:bg-darkgreen">
                <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">Add Option</h5>
                </a>
              </div>

              </div>
              <div class="relative mb-10">
                <button id="close-opt-btn" class="bg-red hover:bg-black text-white rounded-md px-10 py-1">Close</button>
              </div>
          </div>
        </div>
        `
        optPop.appendChild(optionPopUp);
        var eventPopId = sessionStorage.getItem("event ID");
        const q = query(collection(db, "Events", eventPopId, "buttons"), where("eventBtnID", "==", eventPopId));
      
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

          let addOptBtn = document.querySelector(`#${doccc.id}-add-opt`)
          let newBtn = document.createElement("div");
          newBtn.innerHTML = `
          <a href="https://${doc.data().btnURL}/" target="_blank" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border border-navy rounded-lg shadow hover:bg-black">
          <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${doc.data().btnName}</h5>
          </a>
          `
          addOptBtn.before(newBtn)

        });


        let overlay = document.querySelector(".overlay");
        let optpopHidden = document.querySelector("#opt-event-pop");
        if (optpopHidden) {

          optpopHidden.classList.add("flex");
          optpopHidden.classList.remove("hidden");
          overlay.classList.remove("hidden");
        }

        let closeOptPop = document.querySelector("#close-opt-btn");
        if (closeOptPop) {
          closeOptPop.addEventListener('click',() => {
            optionPopUp.remove()
            overlay.classList.add("hidden");
          });
        }

        let addbtn = document.querySelector(`#${doccc.id}-add-opt`);
        if (addbtn) {
          addbtn.addEventListener('click',() => {

            let addbtnpop = document.querySelector("#add-btn-pop");
            let addBtnPopUp = document.createElement("div");

          addBtnPopUp.innerHTML = `
          
          <div id="add-btn-popup" class="hidden items-center justify-center relative">
            <div class=" flex fixed z-10 top-0 w-full h-full bg-black bg-opacity-60">
              <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
                  <div class="file_upload flex flex-col justify-center p-5 relative border-4 border-dotted border-grey rounded-lg" style="width: 450px">

                  <div id="form" class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div class="relative">
                      <input autocomplete="off" required id="new-btn-name" name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button Name" />
                      <label for="new-btn-name" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button Name</label>
                    </div>

                    <div id="btn-error-one"></div>

                    <div class="relative">
                      <input autocomplete="off" required pattern="https://.*" id="new-btn-link" name="name" type="url" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Button URL" />
                      <label for="new-btn-link" class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Button URL</label>
                    </div>
                    

                    <div id="btn-error-two"></div>

                    <div class="relative">
                      <button id="add-btn-click" class="bg-darkblue hover:bg-blue text-white rounded-md px-2 py-1">add</button>
                      <button id="close-event-btn" class="bg-grey hover:bg-blue text-white rounded-md px-2 py-1">Close</button>
                    </div>
                  </div>

                  </div>
              </div>
            </div>
          </div>
          `
          addbtnpop.appendChild(addBtnPopUp);

          let overlay = document.querySelector(".overlay");
          let addBtnPopHidden = document.querySelector("#add-btn-popup");
          addBtnPopHidden.classList.add("flex");
          addBtnPopHidden.classList.remove("hidden");
          overlay.classList.remove("hidden");

          let closeEventPop = document.querySelector("#close-event-btn");
          if (closeEventPop) {
            closeEventPop.addEventListener('click',() => {
              addBtnPopHidden.classList.add("hidden");
              addBtnPopHidden.classList.remove("flex");
              overlay.classList.add("hidden");
            });
          }


          let eventNewBtn = document.querySelector("#add-btn-click");
        if (eventNewBtn) {
          eventNewBtn.addEventListener('click', async () => {

            let btnErrorOne = document.querySelector("#btn-error-one");
            let btnErrorTwo = document.querySelector("#btn-error-two");

            let newBtnName = document.querySelector("#new-btn-name");
            let newBtnLink = document.querySelector("#new-btn-link");

            if (newBtnName.value === '' || newBtnName.value === null || newBtnLink.value === '' || newBtnLink.value === null) {
              if (newBtnName.value === '' || newBtnName.value === null) {
          
                btnErrorOne.innerHTML = "*Button name is required"
              } else {
                btnErrorOne.classList.add("hidden")
              }
            
              if (newBtnLink.value === '' || newBtnLink.value === null) {
            
                btnErrorTwo.innerHTML = "*Button URL is required"
              } else {
                btnErrorTwo.classList.add("hidden")
              }
            } else {

              try {

                var eventPopId = sessionStorage.getItem("event ID");
                console.log(eventPopId)


                const btnRef = await addDoc(collection(db, "Events", eventPopId, "buttons"), {
                  btnName: newBtnName.value,
                  btnURL: newBtnLink.value,
                  eventBtnID: eventPopId,
                });

                addBtnPopHidden.classList.add("hidden");
                addBtnPopHidden.classList.remove("flex");
                alert("New Button Added!")
                location.reload();
              } catch(e) {
                console.log(e)
              }

            }
          });

        }

          });
          }

      }
    });
  }

});


  var eventPopId = sessionStorage.getItem("event ID");
  const q = query(collection(db, "excelSheetMembers"), where("eventId", "array-contains", eventPopId));

  const querySnapshotot = await getDocs(q);
  querySnapshotot.forEach(async(docx) => {

    if (docx.data().Name != "Name" && "name") {

      let attendContainer = document.querySelector("#attend-container");
  
      if (attendContainer) {
        let attendList = document.createElement("tbody");
        // attendList.setAttribute('class', `${doccc.id}`);
  
        attendList.innerHTML = `
        <tr class="bg-navy border-b border-grey">
          <td scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap">
              ${docx.data().Name}
          </td>
          <td class="px-6 py-4">
            ${docx.data().Surname}
          </td>
          <td class="px-6 py-4">
              ${docx.data().email}
          </td>
          <td class="px-6 py-4">
              ${docx.data().jobTitle}
          </td>
          <td class="px-6 py-4">
              ${docx.data().Company}
          </td>
          <td class="px-6 py-4">
              ${docx.data().Country}
          </td>
          <td id=${docx.id}-invite class="px-6 py-4">
            <button id=${docx.id} type="button" class="text-white bg-blue hover:bg-darkblue font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">Invite To Meeting</button>
          </td>
          
      </tr>
        `
        attendContainer.appendChild(attendList);
      }
    }

    
    let inviteContainer = document.querySelector(`#${docx.id}-invite`)
    let inviteBTn = document.querySelector(`#${docx.id}`)
    let adminName = sessionStorage.getItem("UserName")
    if (inviteBTn) {
      inviteBTn.addEventListener('click', async() => {

        const docRef = await addDoc(collection(db, "Events", eventPopId, "meetings"), {
          datetime: serverTimestamp(),
          senderID: adminID,
          receiverID: docx.id,
          receiver_username: `${docx.data().Name} ${docx.data().Surname}`,
          sender_username: adminName,
          status: 0,
        });

        inviteContainer.innerHTML = `
          <p class="text-yellow">User invited to meeting</p>
        `
      })

      const q = query(collection(db, "Events", eventPopId, "meetings"), where("receiverID", "==", docx.id));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        

        inviteContainer.innerHTML = `
          <p class="text-yellow">User invited to meeting</p>
        `

      });

    }


  });


// Polls : 

let closeEventPop = document.querySelector("#close-poll-btn");
let addPoll = document.querySelector("#add-poll");
let pollPop = document.querySelector("#poll-pop");

  if (addPoll) {
    addPoll.addEventListener('click', () => {
      pollPop.classList.remove("hidden");
      pollPop.classList.add("block");
      overlay.classList.remove("hidden");
    });
    
    if (closeEventPop) {
      closeEventPop.addEventListener('click', () => {
        pollPop.classList.add("hidden");
        pollPop.classList.remove("block");
        overlay.classList.add("hidden");
      });
    }
    
    
    let pollBtn = document.querySelector("#add-poll-btn");
    let pollName = document.querySelector("#poll-name");
    let optionOne = document.querySelector("#poll-opt-one");
    let optionTwo = document.querySelector("#poll-opt-two");
    
    let pollErrorOne = document.querySelector("#poll-error-one")
    let pollErrorTwo = document.querySelector("#poll-error-two")
    let pollErrorThree = document.querySelector("#poll-error-three")


    
    let idList = [];
    let addOption = document.querySelector("#add-opt-btn");
    if (addOption) {

      var count = 2;
      addOption.addEventListener('click', () => {
        count++;

        if (count>20){
          addOption.disabled = true;
          addOption.classList.add("hidden");
        } else {
          
            let newOpt = document.createElement("div");
            let form = document.querySelector("#form");
            newOpt.classList.add("relative");
            // newOpt.setAttribute("id", `${count}-id`)
    
            newOpt.innerHTML = `
            <input autocomplete="off" required id=input${count}-id name="name" type="text" class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Option" />
            <label for=input${count}-id class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Option ${count}</label>
            `
            form.appendChild(newOpt);
        }

        let dd = document.querySelector(`#input${count}-id`);
        let ww = dd.getAttribute("id");
        // if (dd) {

        //   console.log(dd.value)
        // }

       
        idList.push(ww)

        console.log(idList);
        console.log(count);
        
      })
      
      
    }
    
    if (pollBtn) {
      pollBtn.addEventListener('click', async (e) => {
    
      if (pollName.value === '' || pollName.value === null || optionOne.value === '' || optionOne.value === null || optionTwo.value === '' || optionTwo.value === null) {
        if (pollName.value === '' || pollName.value === null) {
    
          pollErrorOne.innerHTML = "*Poll name is required"
        } else {
          pollErrorOne.classList.add("hidden")
        }
      
        if (optionOne.value === '' || optionOne.value === null) {
      
          pollErrorTwo.innerHTML = "*This field is required"
        } else {
          pollErrorTwo.classList.add("hidden")
        }
        if (optionTwo.value === '' || optionTwo.value === null) {
      
          pollErrorThree.innerHTML = "*This field is required"
        } else {
          pollErrorThree.classList.add("hidden")
        }
      } else {
        pollPop.classList.add("hidden");
        pollPop.classList.remove("block");
        overlay.classList.add("hidden");
    
        try {

            const docRef = await addDoc(collection(db, "Events", eventPopId, "polls"), {
              pollName: pollName.value,
            });
              
            const subDocRef = await addDoc(collection(db, "Events", eventPopId, "polls", docRef.id, "options"), {
              pollOption: optionOne.value,
              voters: [],
              pollID: docRef.id,
            });

            const subbDocRef = await addDoc(collection(db, "Events", eventPopId, "polls", docRef.id, "options"), {
              pollOption: optionTwo.value,
              voters: [],
              pollID: docRef.id,
            });

            for (let i = 0; i< idList.length; i++) {
              let idd = document.getElementById(idList[i]).value;
              if (idd != null) {
                const subbDocRef = await addDoc(collection(db, "Events", eventPopId, "polls", docRef.id, "options"), {
                  pollOption: idd,
                  voters: [],
                  pollID: docRef.id,
                });
              }
              
            }

          alert("Event Added Successfully")
          location.reload();
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    });
    }
  }

// List for Polls Page

let pollBlok = document.querySelector(".poll-block");

if (pollBlok) {

  let listInt = [];
  let listSum = [];
  
  const querySnapshotxxx = await getDocs(collection(db, "Events", eventPopId, "polls"));
  querySnapshotxxx.forEach(async(doc) => {
  
    const q = query(collection(db, "Events", eventPopId, "polls", doc.id, "options" ));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(docc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
  
      let optionVoters = docc.data().voters.length;
      listInt.push(optionVoters);
  
      
    });
    let sum = 0
    const s = listInt.reduce((partialSum, a) => partialSum + a, 0);
    listSum.push(s);
    listInt = []
    sum = 0;
  });
  let z = 0;
  
  
  const querySnapshotxx = await getDocs(collection(db, "Events", eventPopId, "polls"));
  querySnapshotxx.forEach(async(doc) => {
  
    let pollContainer = document.querySelector("#poll-container");
  
    if (pollContainer) {
  
      
      let pollBlock = document.createElement("div");
      
      pollBlock.setAttribute('id', `${doc.id}`);
      
      pollBlock.innerHTML = `
      <a href="pollDetails.html">
      <div class="up-click rounded-xl w-full grid grid-cols-12 bg-grey text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform" href="#">
                        
      <!-- Icon -->
      <div class="col-span-12 md:col-span-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
      </div>
      
      <!-- Title -->
      <div class="col-span-11 xl: ml-6">
          <p class="text-blue-600 font-semibold"> ${doc.data().pollName} </p>
          </div>
          
          <!-- Description -->
          <div id="poption-${doc.id}" class="md:col-start-2 col-span-11 xl: ml-2">
  
          </div>
          <button id=${doc.id}-edit class="bg-black md:col-start-10 col-span-12 hover:bg-darkblue text-white rounded-md px-2 py-1">Edit / Delete Poll</button>
          </div>
          </a>
          `;
          
          pollContainer.appendChild(pollBlock);
  
          const q = query(collection(db, "Events", eventPopId, "polls", doc.id, "options"));
  
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async(docc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
  
            let popt = document.querySelector(`#poption-${doc.id}`);
            let optBar = document.createElement("div")
            optBar.setAttribute('class', 'my-2');
            optBar.setAttribute('id', `${docc.id}`);
  
            let percent = ((docc.data().voters.length / listSum[z]) * 100);
            percent = Math.round(percent)
  
            optBar.innerHTML = `
            <div class="w-full bg-navy rounded-full dark:bg-gray-700 relative">
              <p class="absolute text-sm text-center left-[45%] font-semibold">${docc.data().pollOption} <br/> ${isNaN(percent)?0:percent}%</p>
              <div class="bg-blue text-xs font-medium text-white text-center p-5 leading-none rounded-full" style="width: ${isNaN(percent) || percent == 0 ?1:percent}%"></div>
            </div>
            `
            
            popt.appendChild(optBar);
            
          });
          
          z++
          if (pollBlock) {
            let pollIDs = pollBlock.getAttribute('id')
            pollBlock.addEventListener('click', () => {
              sessionStorage.setItem("poll ID", pollIDs);
            });
          }
    }
  });

  
}


var PollDocID = sessionStorage.getItem("poll ID");
//   console.log(PollDocID)

let pollDet = document.querySelector("#poll-detail");
  if (pollDet) {
    

    let listInt = [];
    let listSum = [];
    
    const querySnapshotxxx = await getDocs(collection(db, "Events", eventPopId, "polls"));
    querySnapshotxxx.forEach(async(doc) => {
    
      const q = query(collection(db, "Events", eventPopId, "polls", doc.id, "options" ));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async(docc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
    
        let optionVoters = docc.data().voters.length;
        listInt.push(optionVoters);
    
        
      });
      let sum = 0
      const s = listInt.reduce((partialSum, a) => partialSum + a, 0);
      listSum.push(s);
      listInt = []
      sum = 0;
    });
    let z = 0;



    const querySnapshot = await getDocs(collection(db, "Events", eventPopId, "polls"));
    querySnapshot.forEach(async(doc) => {
      // doc.data() is never undefined for query doc snapshots

      if (doc.id == PollDocID) {
        let pollNameDet = document.querySelector("#poll-name");
        pollNameDet.innerHTML = `${doc.data().pollName}`
        

        const q = query(collection(db, "Events", eventPopId, "polls", PollDocID, "options"));
  
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async(docc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
  
            let optBar = document.createElement("div")
            optBar.setAttribute('class', 'my-2');
            optBar.setAttribute('id', `${docc.id}`);
  
            let percent = ((docc.data().voters.length / listSum[z]) * 100);
            percent = Math.round(percent)
  
            optBar.innerHTML = `
            <div class="w-full bg-navy rounded-full relative my-10 flex items-center">
              <p class="absolute text-lg text-white text-center left-[48%] font-semibold">${docc.data().pollOption} <br/> ${isNaN(percent)?0:percent}%</p>
              <div class="bg-blue text-xs font-medium text-white text-center p-8 leading-none rounded-full" style="width: ${isNaN(percent) || percent == 0 ?1:percent}%"></div>
            </div>
            `
            
            pollDet.appendChild(optBar);
            
          });
          
          z++

      }
    });
  }



let chatUserList = document.querySelector("#user-list");
if (chatUserList) {
const querySnapshoyt = await getDocs(collection(db, "Events", eventPopId, "users"));
querySnapshoyt.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  // console.log(doc.id, " => ", doc.data());
  
  

    if (doc.id != adminID) {
      let user = document.createElement("div");
      user.innerHTML = `
      

      <div id=${doc.id}>
        <a href="chatroom.html" class="block max-w-[180px] min-w-[180px] min-h-[80px] p-6 bg-navy border transition-colors border-navy rounded-lg shadow hover:bg-grey">
        <h5 class="mb-2 text-2xl text-center font-bold tracking-tight text-white">${doc.data().name}</h5>
        </a>
      </div>
      `

      if(user) {
        user.addEventListener('click', () => {
          sessionStorage.setItem("chatUser", `${doc.id}`);
        });
      }


      chatUserList.appendChild(user)
    }
    
    
  });
}



var eventPopId = sessionStorage.getItem("event ID");
var chatUser = sessionStorage.getItem("chatUser");

let chatContainer = document.querySelector("#chat-msgs");
if (chatContainer) {
const qe = query(collection(db, "Events", eventPopId, "users", chatUser, "chats"), orderBy("datetime"));
const unsubscribe = onSnapshot(qe, (querySnapshot) => {
  chatContainer.innerHTML = ``;
  querySnapshot.forEach((doc) => {

      if (doc.data().senderId == adminID) {

        let msgSent = document.createElement("div");
        msgSent.setAttribute('class', 'flex justify-end mb-4 mr-4');
        msgSent.setAttribute('id', 'msg-sender');
        msgSent.innerHTML = `
        <div class="mr-2 py-3 px-4 bg-blue rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
          ${doc.data().text}
        </div>
        `
        chatContainer.appendChild(msgSent);
      } else if (doc.data().senderId == chatUser){

        let msgSent = document.createElement("div");
        msgSent.setAttribute('class', 'flex justify-start mb-4 ml-4');
        msgSent.setAttribute('id', 'msg-receiver');
        msgSent.innerHTML = `
        <div class="ml-2 py-3 px-4 bg-grey rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
          ${doc.data().text}
        </div>
        `
        chatContainer.appendChild(msgSent);
        
      }
      
      
    });
  });
}


let msgInput = document.querySelector("#msg-input");
let sendBtn = document.querySelector("#send-msg");
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {

    if (msgInput.value != "" || null) {
      await addDoc(collection(db, "Events", eventPopId, "users", chatUser, "chats"), {
        datetime: serverTimestamp(),
        reciverId: chatUser,
        senderId: adminID,
        text: msgInput.value
      });
      await addDoc(collection(db, "Events", eventPopId, "users", adminID, "chats"), {
        datetime: serverTimestamp(),
        reciverId: chatUser,
        senderId: adminID,
        text: msgInput.value
      });
      window.scrollBy(0, 1000000);
      msgInput.value = ""
    }
  })
}

