// import { authService } from "./services/authService";

// function App() {
//   function testValidSignup() {
//     try {
//       const user = authService.signup(
//         "Rahul",
//         "rahul@emora.com",
//         "test123",
//         "test123"
//       );

//       console.log("VALID SIGNUP:", user);
//     } catch (error) {
//       console.error("SIGNUP ERROR:", error);
//     }
//   }
//   function testValidLogin() {
//     try {
//       const session = authService.login(
//         "rahul@emora.com",
//         "test123"
//       );

//       console.log("VALID LOGIN:", session);
//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//     }
//   }

//   function testInvalidLoginEmail() {
//     try {
//       authService.login(
//         "rahul@invalid",
//         "test123"
//       );
//     } catch (error) {
//       console.error("INVALID LOGIN EMAIL:", error);
//     }
//   }

//   function testWrongPassword() {
//     try {
//       authService.login(
//         "rahul@emora.com",
//         "wrong123"
//       );
//     } catch (error) {
//       console.error("WRONG PASSWORD:", error);
//     }
//   }

//   function testInvalidEmail() {
//     try {
//       authService.signup(
//         "Rahul",
//         "rahul@invalid",
//         "test123",
//         "test123"
//       );
//     } catch (error) {
//       console.error("INVALID EMAIL:", error);
//     }
//   }

//   function testShortPassword() {
//     try {
//       authService.signup(
//         "Rahul",
//         "rahul2@emora.com",
//         "123",
//         "123"
//       );
//     } catch (error) {
//       console.error("SHORT PASSWORD:", error);
//     }
//   }

//   function testPasswordMismatch() {
//     try {
//       authService.signup(
//         "Rahul",
//         "rahul3@emora.com",
//         "test123",
//         "different"
//       );
//     } catch (error) {
//       console.error("PASSWORD MISMATCH:", error);
//     }
//   }

//   function testEmptyName() {
//     try {
//       authService.signup(
//         "",
//         "rahul4@emora.com",
//         "test123",
//         "test123"
//       );
//     } catch (error) {
//       console.error("EMPTY NAME:", error);
//     }
//   }

//   return (
//     <div>
//       <h1>EMORA Validation Test</h1>

//       <button onClick={testValidSignup}>
//         Valid Signup
//       </button>

//       <button onClick={testInvalidEmail}>
//         Invalid Email
//       </button>

//       <button onClick={testShortPassword}>
//         Short Password
//       </button>

//       <button onClick={testPasswordMismatch}>
//         Password Mismatch
//       </button>

//       <button onClick={testEmptyName}>
//         Empty Name
//       </button>
//       <button onClick={testValidLogin}>
//         Valid Login
//       </button>

//       <button onClick={testInvalidLoginEmail}>
//         Invalid Login Email
//       </button>

//       <button onClick={testWrongPassword}>
//         Wrong Password
//       </button>
//     </div>
//   );

function App() {
  return (
    <div>
      <h1>EMORA</h1>
      <p>Application is under development.</p>
    </div>
  );
}

export default App;