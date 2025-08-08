import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import baseUrl from '../../config';
export default function SignupModal({ close }) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName]=useState(''), [phone,setPhone]=useState(''), [password,setPass]=useState(''), [otp,setOtp]=useState(''), [err,setErr]=useState('');
  const s1=async e=>{ e.preventDefault(); try{ await axios.post(`${baseUrl}api/auth/login`,{name,phone,password}); setStep(2); }catch{setErr('Signup failed');}};
  const s2=async e=>{ e.preventDefault(); try{ const { data } = await axios.post('/api/auth/verify',{ phone, otp }); login(data.user,data.token); close(); }catch{setErr('Invalid OTP'); }};
  return (
    <div className="modal show d-block"><div className="modal-dialog"><div className="modal-content">
      <div className="modal-header"><h5>{step===1?'Signup':'Verify OTP'}</h5><button className="btn-close" onClick={close}/></div>
      <form className="modal-body" onSubmit={step===1?s1:s2}>
        {step===1 ? (
          <>
            <input type="text" className="form-control mb-2" placeholder="Name" required value={name} onChange={e=>setName(e.target.value)}/>
            <input type="number" className="form-control mb-2" placeholder="Phone" required value={phone} onChange={e=>setPhone(e.target.value)}/>
            <input type="password" className="form-control mb-2" placeholder="Password" required value={password} onChange={e=>setPass(e.target.value)}/>
          </>
        ) : (
          <input type="text" className="form-control mb-2" placeholder="OTP" required value={otp} onChange={e=>setOtp(e.target.value)}/>
        )}
        {err && <div className="text-danger mb-2">{err}</div>}
        <button className="btn btn-success w-100">{step===1?'Signup':'Verify OTP'}</button>
      </form>
    </div></div></div>
  );
}
