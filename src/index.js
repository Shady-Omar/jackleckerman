import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, connectFirestoreEmulator, query, where, setDoc, runTransaction } from "firebase/firestore";
import emailjs from '@emailjs/browser';
import { read, writeFileXLSX } from "xlsx";
import XLSX from 'xlsx';
import { MailSlurp } from "mailslurp-client";




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

      // var params = {
      //   from_name : `${fname.value} ${lname.value}`,
      //   email_id: email.value,
      //   password: pass.toString()
      // }
      // emailjs.send('service_p8wkknm', 'template_n8eujco', params, "F_Io2W4ApCRvQJTbo")
      //   .then(function(response) {
      //     console.log('SUCCESS!', response.status, response.text);
      //   }, function(error) {
      //     console.log('FAILED...', error);
      //   });

      //MailJet:
      
      /**
 *
 * Run:
 *
 */

      // const myModule = require('node-mailjet');

      // if (myModule) {
      //   console.log('Module imported successfully');
      // } else {
      //   console.log('Module not found');
      // }


      const Mailjet = require('node-mailjet');

      const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC,
        process.env.MJ_APIKEY_PRIVATE,
      );
      
      function sendEmail(recipient) {
        return mailjet
          .post("send", { version: "v3.1" })
          .request({
            Messages: [
              {
                From: {
                  Email: "shady22elmagic@gmail.com",
                  Name: "JackLeckerman",
                },
                To: [
                  {
                    Email: email.value,
                  },
                ],
                Subject: "one",
                TextPart: "two",
                HTMLPart: "three",
              },
            ],
          })
          .then((result) => {
            // do something with the send result or ignore
            console.log("done")
          })
          .catch((err) => {
            // handle an error
            console.log("error")
          });
      }

      const api = new MailSlurp({ apiKey: "db682089d96bec6fbce322f0ff2467b9e1ef6f639d663eb4a6de00332dbe2c2c" });
      const newEmailInbox = await api.createInbox();
      const result = await sendEmail(newEmailInbox.emailAddress);
      expect(result.success).to.be(true);

      // **************

    try {
      const docRef = await addDoc(collection(db, "coordinators"), {
        firstName: fname.value,
        lastName: lname.value,
        email: email.value,
        password: pass
      });
      console.log("Document written: yes");
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


  if (eventName.value === '' || eventName.value === null || eventSelectColor.value === 'Select Color') {
    if (eventName.value === '' || eventName.value === null) {

      eventErrorOne.innerHTML = "*Event name is required"
    } else {
      eventErrorOne.classList.add("hidden")
    }
  
    if (eventSelectColor.value === 'Select Color') {
  
      eventErrorTwo.innerHTML = "*Select Color"
    } else {
      eventErrorTwo.classList.add("hidden")
    }
  } else {
    eventPop.classList.add("hidden");
    eventPop.classList.remove("block");
    overlay.classList.add("hidden");

    try {
      const docRef = await addDoc(collection(db, "Events"), {
        eventName: eventName.value,
        eventcolor: eventSelectColor.value,
      });
      console.log("Document written: yes");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});
}

const querySnapshot = await getDocs(collection(db, "coordinators"));
querySnapshot.forEach((doc) => {


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

  
});



const querySnapshots = await getDocs(collection(db, "Events"));
querySnapshots.forEach((doctwo) => {


  // List for Events Page
  let eventContainer = document.querySelector("#event-container");

  if (eventContainer) {

    let eventBlock = document.createElement("div");

    eventBlock.setAttribute('id', `${doctwo.id}`);

    eventBlock.innerHTML = `
    <div class="up-click rounded-xl w-full grid grid-cols-12 bg-grey text-white shadow-xl p-3 gap-2 items-center hover:shadow-lg transition delay-150 duration-300 ease-in-out hover:scale-105 transform" href="#">
                      
    <!-- Icon -->
    <div class="col-span-12 md:col-span-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    </div>

    <!-- Title -->
    <div class="col-span-11 xl: ml-6">
      <p class="text-blue-600 font-semibold"> ${doctwo.data().eventName} </p>
    </div>

    <!-- Description -->
    <div class="md:col-start-2 col-span-11 xl: ml-6">
      <p class="text-sm text-gray-800 font-light"> ${doctwo.data().eventcolor} </p>
    </div>

    </div>
    `;

    eventContainer.appendChild(eventBlock);
    
    let uploadExcel = document.querySelector(`#${doctwo.id}`);
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
                    await addDoc(collection(db, "excelSheetMembers"), {
                    Name: rows[i][0] || null,
                    Surname: rows[i][1] || null,
                    email: rows[i][2] || null,
                    jobTitle: rows[i][3] || null,
                    Company: rows[i][4] || null,
                    Country: rows[i][5] || null,
                    Password: pass.toString() || null,
                    eventId: eventIds || null

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

                
                console.log("Document written: yes");
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

  }
});




