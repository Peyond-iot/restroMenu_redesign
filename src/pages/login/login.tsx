import React, { useState } from "react";

const Login = () => {
  const [isDisabled, setisDisabled] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // const changeForm = () => {
  //   setMessage("")
  //   setError("")
  //   setEmail("");
  //   setPassword("")
  //   setisDisabled(true)
  // }

  // Email Validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password Validation (At least 6 characters)
  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?]{6,}$/.test(
      password
    );
  };

  // Login function
  const handleLogin = async (e?: React.FormEvent) => {
    setisLoading(true);
    if (e) e.preventDefault(); // Prevent page reload if used inside a form

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
    });

    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      "https://backend-nwcq.onrender.com/api/users/login",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setisLoading(false);
        if (result.token) {
          sessionStorage.setItem("login", JSON.stringify(result));
          window.location.reload();
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        setisLoading(false);
        setError(error);
      });
  };

  const checkEmailInput = async (e: any) => {
    // Check email
    if (!validateEmail(e)) {
      setisDisabled(true);
      setError("Invalid email format.");
      return;
    } else {
      if (validateEmail(e) && validatePassword(password)) {
        setisDisabled(false);
        setError(""); // Clear any previous errors
      }
    }
  };

  const checkPasswordInput = async (pass: any) => {
    // Check password
    if (!validatePassword(pass)) {
      setisDisabled(true);
      setError(
        "Password must be combination of letters and digits and at least 6 characters"
      );
      return;
    } else {
      if (validateEmail(email) && validatePassword(pass)) {
        setisDisabled(false);
        setError(""); // Clear any previous errors
      }
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-40 backdrop-blur-sm z-50">
          <div className="p-4 bg-white rounded-full shadow-lg">
            <img
              src="assets/loading.gif"
              className="w-20 h-20"
              alt="Loading..."
            />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="font-bold text-3xl font-serif uppercase mb-6 mx-6 text-center text-red-500">
          Sign-In
        </h1>
        <div className="flex lg:flex-row flex-col lg:justify-between lg:gap-12 items-center bg-white px-8 rounded-lg shadow-lg lg:w-1/2 mx-6 pb-12">
          <div className="w-full lg:pb-6 pt-6">
            <p className="font-serif text-base text-justify">
              Welcome to{" "}
              <span className="font-bold text-red-500">Restro Menu App,</span>{" "}
              where flavors come alive with every bite! 🍽️✨ We take pride in
              serving freshly prepared dishes made from the finest ingredients,
              bringing you a delightful culinary experience. Enjoy a warm, cozy
              ambiance perfect for family gatherings, romantic dinners, or
              casual meet-ups. 🍷🍕
            </p>
          </div>

          <div className="w-full pt-6">
            <p className="text-red-500 text-lg text-center font-serif my-2">
              {message}
            </p>

            <form className="space-y-4">
              <div>
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                  value={email}
                  onChange={(e) => {
                    setEmail(e?.target?.value);
                    checkEmailInput(e?.target?.value);
                  }}
                />
              </div>

              <div>
                <label className="block text-gray-600">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500"
                    value={password}
                    onChange={(e) => {
                      setPassword(e?.target?.value);
                      checkPasswordInput(e?.target?.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <img
                        className="w-6 h-6"
                        src="./assets/eye_close.svg"
                        alt="eyeClose"
                      />
                    ) : (
                      <img
                        className="w-6 h-6"
                        src="./assets/eye_open.svg"
                        alt="eyeOpen"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </form>
            <button
              className={`w-full mt-6 text-white py-2 rounded
                            ${
                              isDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 cursor-pointer"
                            }`}
              disabled={isDisabled}
              onClick={() => {
                handleLogin();
                setisLoading(true);
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
