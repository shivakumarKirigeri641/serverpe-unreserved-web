// MobileOtpLogin.jsx
import React, { useState, useRef, useEffect } from "react";
import { Fade, Slide } from "react-awesome-reveal";

const Login = ({ onVerified }) => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1); // 1: mobile, 2: otp
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef([]);
  const mobileRef = useRef(null);

  useEffect(() => {
    if (step === 1) mobileRef.current?.focus();
    if (step === 2) otpRefs.current[0]?.focus();
  }, [step]);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleGetOtp = () => {
    if (/^\d{10}$/.test(mobile)) {
      setError("");
      setStep(2);
      setTimer(30);
      setOtp(["", "", "", ""]);
    } else setError("Please enter a valid 10-digit mobile number.");
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0)
      otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    if (otp.every((d) => /^\d$/.test(d))) {
      onVerified(); // callback to parent
    } else setError("Please enter a valid 4-digit OTP.");
  };

  const isVerifyDisabled = timer <= 0 || otp.some((d) => !d);

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        {step === 1 ? "Login with Mobile" : "Enter OTP"}
      </h2>
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
              onChange={(e) => setMobile(e.target.value.replace(/\D/, ""))}
              className="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
              placeholder=" "
            />
            <label className="absolute left-0 top-2 text-gray-400 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-indigo-500 peer-focus:text-sm transition-all">
              Mobile Number
            </label>
          </div>
          <button
            onClick={handleGetOtp}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
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
          <p className="text-center text-gray-400 text-sm">
            {timer > 0
              ? `Resend OTP in ${timer}s`
              : "OTP expired, request again"}
          </p>
        </Slide>
      )}
    </div>
  );
};

export default Login;
