import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Slide, Fade } from "react-awesome-reveal";
import { useDispatch } from "react-redux";
import { addStationsList } from "../store/slices/stationsListSlice";
const Login = ({ onVerified }) => {
  const dispatch = useDispatch();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [msg, setmsg] = useState("");
  const [timer, setTimer] = useState(300);
  const otpRefs = useRef([]);
  const mobileRef = useRef(null);

  // Focus input on step change
  useEffect(() => {
    if (step === 1) mobileRef.current?.focus();
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  // OTP countdown timer
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleGetOtp = async () => {
    setError("");
    setmsg("");
    if (/^\d{10}$/.test(mobile)) {
      try {
        // call send-otp api
        const result = await axios.post(
          process.env.REACT_APP_API_SERVER + "/unreserved-ticket/user/send-otp",
          { mobile_number: mobile },
          { withCredentials: true }
        );
        if (result?.data?.success) {
          setmsg(result?.data?.message);
          setStep(2);
          setTimer(30);
          setOtp(["", "", "", ""]);
        } else {
          setError(result?.data?.message);
        }
      } catch (err) {
        setError("Something went wrong.");
      }
    } else setError("Please enter a valid 10-digit mobile number.");
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < otp.length - 1) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.every((d) => /^\d$/.test(d))) {
      setError("");
      setmsg("");
      try {
        console.log(mobile, otp.join(""));
        const result = await axios.post(
          process.env.REACT_APP_API_SERVER +
            "/unreserved-ticket/user/verify-otp",
          { mobile_number: mobile, otp: otp.join("") },
          { withCredentials: true }
        );
        console.log(result?.data);
        if (result?.data?.success) {
          //get stations and store them in reducer
          const result_stations = await axios.get(
            process.env.REACT_APP_API_SERVER +
              "/unreserved-ticket/user/stations",
            { withCredentials: true }
          );
          dispatch(addStationsList(result_stations?.data?.data));
          onVerified();
        } else {
          setError(result?.data?.message);
          setOtp(["", "", "", ""]);
          otpRefs.current[0]?.focus();
        }
      } catch (err) {
        setError(err.message);
      }
    } else setError("Please enter a valid 4-digit OTP.");
  };

  const handleResendOtp = async () => {
    setError("");
    setOtp(["", "", "", ""]);
    setTimer(30);
    otpRefs.current[0]?.focus();
    try {
      const result = await axios.post(
        process.env.REACT_APP_API_SERVER + "/unreserved-ticket/user/send-otp",
        { mobile_number: mobile },
        { withCredentials: true }
      );
      if (result?.data?.success) {
        setmsg(result?.data?.message);
        setStep(2);
        setTimer(30);
        setOtp(["", "", "", ""]);
      } else {
        setError(result?.data?.message);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  const isVerifyDisabled = timer <= 0 || otp.some((d) => !d);

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        {step === 1 ? "Login with Mobile" : "Enter OTP"}
      </h2>

      {msg && (
        <div className="text-green-500 text-sm mb-3 text-center">{msg}</div>
      )}
      {error && (
        <div className="text-red-500 text-sm mb-3 text-center">{error}</div>
      )}

      {step === 1 && (
        <Slide direction="up" triggerOnce>
          <div className="relative mb-6">
            <input
              type="tel"
              ref={mobileRef}
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
              placeholder=" "
            />
            <label className="absolute left-0 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-indigo-500 peer-focus:text-sm transition-all">
              Mobile Number
            </label>
          </div>
          <button
            onClick={handleGetOtp}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition mb-3"
          >
            Get OTP
          </button>
        </Slide>
      )}

      {step === 2 && (
        <Slide direction="up" triggerOnce>
          <p className="text-center text-gray-500 mb-4">
            OTP sent to <span className="font-semibold">{mobile}</span>
          </p>

          <div className="flex justify-between mb-4 space-x-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                aria-label={`OTP Digit ${i + 1}`}
                ref={(el) => (otpRefs.current[i] = el)}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                className="w-14 h-14 text-center text-xl border rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            ))}
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isVerifyDisabled}
            className={`w-full py-3 rounded-xl font-semibold mb-3 transition ${
              isVerifyDisabled
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Verify
          </button>

          {timer <= 0 && (
            <Fade direction="up" triggerOnce>
              <button
                onClick={handleResendOtp}
                className="w-full py-2 text-indigo-600 font-medium hover:underline mb-2 transition"
              >
                Resend OTP
              </button>
            </Fade>
          )}

          <p className="text-center text-red-400 font-semibold text-sm mb-3">
            {timer > 0 && (
              <Fade key={timer} direction="up" triggerOnce>
                Resend OTP in {timer}s
              </Fade>
            )}
            {timer === 0 && "OTP expired, request again"}
          </p>

          {/* Back button */}
          <button
            onClick={() => {
              setStep(1);
              setOtp(["", "", "", ""]);
              setError("");
              setmsg("");
              setTimer(30);
            }}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-300 transition"
          >
            Back
          </button>
        </Slide>
      )}
    </div>
  );
};

export default Login;
