// import { LitElement, html, css } from "lit";
// import { customElement, property, state, query } from "lit/decorators.js";

// export interface CreateCharacter {
//   name: string;
// }

// @customElement("onboard-player-page")
// export class OnboardPlayerPage extends LitElement {
//   @query("#create-form")
//   accessor createForm: any;

//   protected firstUpdated() {
//     // Emit on-create-character event
//     this.createForm.addEventListener("submit", (e: FormDataEvent) => {
//       e.preventDefault(); // prevent refresh browser
//       new FormData(this.createForm); // construct a FormData object, which fires the formdata event
//     });
//     this.createForm.addEventListener("formdata", (e: FormDataEvent) => {
//       const parsed = Object.fromEntries(Array.from(e.formData.entries()));
//       // Dispatch on-create event
//       this.dispatchEvent(
//         new CustomEvent<Message>("on-create-character", {
//           bubbles: true,
//           composed: true,
//           detail: {
//             name: parsed.name.toString(),
//           },
//         })
//       );

//       // Clear input
//       this.messageInput.value = "";
//     });
//   }

//   render() {
//     return html`
//       <h1>Create your character</h1>

//       <form id="create-form">
//         <sl-input
//           label="Name"
//           name="name"
//           help-text="What is your character's name?"
//         ></sl-input>
//         <sl-button type="submit" variant="primary">Enter world</sl-button>
//       </form>
//     `;
//   }
// }
