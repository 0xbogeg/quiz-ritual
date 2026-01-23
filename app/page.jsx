'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';


export default function RitualQuiz() {
  const [step, setStep] = useState('landing');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [discord, setDiscord] = useState('');
  const [role, setRole] = useState('');
  const [pfpPreview, setPfpPreview] = useState(null);


  // Logo path dari folder public
  const logoPath = '/logo.png'; // Ganti dengan nama file logo Anda di folder public

  const certRef = useRef(null);

  const parseQuiz = (text) => {
    const blocks = text.split('--------------------------------------------------');
  
    return blocks.map(block => {
      const lines = block
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
  
      if (lines.length === 0) return null;
  
      const questionLine = lines.find(l => /^\d+\./.test(l));
      const question = questionLine?.replace(/^\d+\.\s*/, '');
  
      const options = ['A', 'B', 'C', 'D'].map(letter => {
        const opt = lines.find(l => l.startsWith(letter + '.'));
        return opt?.replace(letter + '.', '').trim();
      });
  
      // ✅ FIX
      const answerLine = lines.find(l => l.startsWith('Answer:'));
      const answerLetter = answerLine?.replace('Answer:', '').trim();
  
      const answerIndex = ['A', 'B', 'C', 'D'].indexOf(answerLetter);
  
      return {
        question,
        options,
        answer: answerIndex
      };
    }).filter(Boolean);
  };
  

  const loadQuiz = async () => {
    const res = await fetch('/quiz/quiz1.txt');
    const text = await res.text();
    setQuestions(parseQuiz(text));
    setStep('quiz');
  };

  const next = (selected) => {
    const updatedAnswers = [...answers, selected];
    setAnswers(updatedAnswers);
  
    if (updatedAnswers.length < questions.length) {
      setCurrent(updatedAnswers.length);
    } else {
      setStep('result');
    }
  };
  
  const score = answers.filter(
    (a, i) => a === questions[i].answer
  ).length;

  const correct = answers.filter(
    (a, i) => a === questions[i].answer
  ).length;
  
  const wrong = questions.length - correct;
  
  const scorePercent = Math.round((correct / questions.length) * 100);

  const level =
    scorePercent >= 80 ? 'Veteran' :
    scorePercent >= 50 ? 'Active' :
    'Newbie';

  const date = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // baru edit download 
  const downloadCert = async () => {
    if (!certRef.current) return;
  
    try {
      await new Promise(r => setTimeout(r, 300));
  
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#111827',
        skipFonts: true,
      });
  
      const link = document.createElement('a');
      link.download = `ritual-certificate-${discord
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase()}.png`;
  
      link.href = dataUrl;
      link.click();
  
    } catch (err) {
      console.error(err);
      alert('Gagal download sertifikat. Silakan refresh dan coba lagi.');
    }
  };
  
  




  const shareX = () => {
    const text = `I just completed the Ritual Community Quiz 🚀\nRole: ${role}\nLevel: ${level}\n\n#Ritual #Web3`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };
  const followX = () => {
    window.open(
      'https://twitter.com/intent/follow?screen_name=0xbogeg',
      '_blank'
    );
  };
  
  const handlePfpUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = () => {
      setPfpPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white flex justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">

        {step === 'landing' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-emerald-500 relative overflow-hidden">
            
            {/* Neon Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 animate-pulse pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* Logo Section with Neon Effect */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Neon glow rings */}
                  <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="absolute inset-0 bg-teal-400 rounded-2xl blur-xl opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  
                  {/* Logo */}
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border-2 border-emerald-500 shadow-lg shadow-emerald-500/50">
                    <img 
                      src={logoPath} 
                      alt="Ritual Logo" 
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl hidden items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-white">R</span>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg animate-pulse">
                Ritual Community Quiz
              </h1>
              
              <p className="text-center text-gray-400 mb-6 sm:mb-8 text-sm px-2">
                Test your knowledge and earn your certificate
              </p>

              <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">●</span> Discord Username
                  </label>
                  <input
                    className="w-full p-3 sm:p-4 bg-gray-900/50 border-2 border-emerald-500/30 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:shadow-lg focus:shadow-emerald-500/20 transition-all text-sm sm:text-base"
                    placeholder="example#1234"
                    value={discord}
                    onChange={e => setDiscord(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                      

                  <label className="text-xs sm:text-sm font-medium text-emerald-300 flex items-center gap-2">
                    <span className="text-emerald-400">●</span> Upload pfp
                  </label>


  <input
    type="file"
    accept="image/*"
    onChange={handlePfpUpload}
    className="w-full p-3 sm:p-4 bg-gray-900/50 border-2 border-emerald-500/30 rounded-xl text-sm"
  />
</div>
<div className="space-y-2">
  <label className="text-xs sm:text-sm font-medium text-emerald-300 flex items-center gap-2">
    <span className="text-emerald-400">●</span> Role 
  </label>
                  <input
                    className="w-full p-3 sm:p-4 bg-gray-900/50 border-2 border-emerald-500/30 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:shadow-lg focus:shadow-emerald-500/20 transition-all text-sm sm:text-base"
                    placeholder=""
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  />
                </div>

                <button
                  disabled={!discord || !role}
                  onClick={loadQuiz}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 p-4 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/80 hover:scale-[1.02] border-2 border-emerald-400/50 text-sm sm:text-base"
                >
                  Start Quiz →
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 mt-4 sm:mt-6">
                Role akan ditampilkan di sertifikat Anda
              </p>
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-emerald-500 relative overflow-hidden">
            
            {/* Neon Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 animate-pulse pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
                <span className="text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/30">
                  Question {current + 1} of {questions.length}
                </span>
                <div className="h-2 w-full sm:w-40 bg-gray-700 rounded-full overflow-hidden border border-emerald-500/30 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 shadow-lg shadow-emerald-500/50"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-100 leading-relaxed">
                {questions[current].question}
              </h2>

              <div className="space-y-3">
                {questions[current].options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => next(i)}
                    className="w-full p-4 rounded-xl border-2 border-emerald-500/30 bg-gray-900/30 hover:bg-emerald-500/10 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/30 text-left transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <span className="font-bold text-emerald-400 mr-3 text-sm sm:text-base">
                      {['A', 'B', 'C', 'D'][i]}.
                    </span>
                    <span className="text-gray-200 text-sm sm:text-base">{o}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4 sm:space-y-6">
            {/* CERTIFICATE */}
            <div
              ref={certRef}
              className="bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 border-4 border-emerald-500 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-emerald-500/50 relative overflow-hidden"
            >
              {/* Neon Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 animate-pulse pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Logo in Certificate */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-3 rounded-2xl border-2 border-emerald-500">
                      <img 
                        src={logoPath} 
                        alt="Logo" 
                        className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl hidden items-center justify-center">
                        <span className="text-xl sm:text-2xl font-bold text-white">R</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b-2 border-emerald-500/30 pb-4 mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                    Certificate of Achievement
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">Ritual Community Quiz</p>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mb-2">
                  This certifies that
                </p>
                        

                {pfpPreview && (
  <div className="flex justify-center mb-4">
    <img
      src={pfpPreview}
      alt="PFP"
      className="w-24 h-24 rounded-full object-cover border-4 border-emerald-400"
    />
  </div>
)}

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-300 mb-4">
                  {discord}
                </h2>

                <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
                  Role: <span className="text-emerald-400 font-semibold">{role}</span>
                </p>

                <div className="bg-gray-800/50 rounded-2xl p-4 sm:p-6 space-y-3 border-2 border-emerald-500/20 shadow-inner">
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-400">✅ Correct Answers</span>
                    <span className="text-emerald-400 font-bold text-lg sm:text-xl">{correct}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-400">❌ Wrong Answers</span>
                    <span className="text-red-400 font-bold text-lg sm:text-xl">{wrong}</span>
                  </div>

                  <div className="border-t border-emerald-500/20 pt-3 mt-3">
                    <div className="flex justify-between items-center text-sm sm:text-base">
                      <span className="text-gray-300 font-semibold">🎯 Final Score</span>
                      <span className="text-emerald-400 font-bold text-xl sm:text-2xl">{scorePercent}%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30 text-sm sm:text-base">
                    <span className="text-emerald-300 font-semibold">🏆 Achievement Level</span>
                    <span className="text-emerald-400 font-bold text-lg sm:text-xl">{level}</span>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-emerald-500/20">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Issued on {date}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Created by 0xBogeg</p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row">

{/* DOWNLOAD */}
<button
  onClick={downloadCert}
  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/80 flex items-center justify-center gap-2 border-2 border-emerald-400/50 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
>
  <span>📥</span>
  <span>Download Certificate</span>
</button>

{/* FOLLOW X (TENGAH) */}
<button
  onClick={followX}
  className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-sky-500/50 hover:shadow-sky-500/80 flex items-center justify-center gap-2 border-2 border-sky-400/50 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
>
  <span>➕</span>
  <span>Follow X</span>
</button>

{/* SHARE X */}
<button
  onClick={shareX}
  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/80 flex items-center justify-center gap-2 border-2 border-blue-400/50 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
>
  <span>📤</span>
  <span>Share to X</span>
</button>

</div>

            <button
              onClick={() => {
                setStep('landing');
                setAnswers([]);
                setCurrent(0);
                setDiscord('');
                setRole('');
                setPfpPreview(null);

              }}
              className="w-full bg-gray-800 hover:bg-gray-700 p-3 sm:p-4 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
            >
              ← Take Quiz Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
}