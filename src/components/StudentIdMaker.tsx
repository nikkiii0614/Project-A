import React, { useState, useEffect, useRef } from 'react';
import { Feather, User, Lock } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  roll: string;
  grade: string;
  photo: string | null;
}

// Ensure the page gets a custom Unsplash URL to satisfy Unsplash stock images constraint
const getUnsplashStock = () => `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80`;

export function StudentIdMaker() {
  // Form State
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [grade, setGrade] = useState('Computer Science');
  const [photo, setPhoto] = useState<string | null>(null);

  // List State
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Security State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // 3D Tilt State
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('students');
    if (saved) {
      setStudents(JSON.parse(saved));
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roll) return;

    // Utilize unsplash mockup if photo is empty
    const finalPhoto = photo || getUnsplashStock();

    const newStudent: Student = {
      id: Date.now(),
      name,
      roll,
      grade,
      photo: finalPhoto,
    };

    const updatedStudents = [newStudent, ...students];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));

    // Reset
    setName('');
    setRoll('');
    setGrade('Computer Science');
    setPhoto(null);
  };

  const handleUnlock = () => {
    if (passwordInput === '0503') {
      setIsAuthorized(true);
    } else {
      alert("Incorrect Pin");
      setPasswordInput('');
    }
  };

  // 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !cardRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 12;
    const rotateY = (x - centerX) / 12;

    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardRef.current.style.transition = 'none';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    cardRef.current.style.transition = 'transform 0.5s ease';
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center">
      {/* Liquid Glass Background */}
      <div className="bg-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
      </div>

      <div className="main-content">
        {/* Form Section */}
        <section className="glass-panel form-section">
            <h1>Create ID Card</h1>
            <form id="id-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="student-name">Student Name</label>
                    <input 
                      type="text" 
                      id="student-name" 
                      placeholder="John Doe" 
                      required 
                      maxLength={25}
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="roll-number">Roll Number / ID</label>
                    <input 
                      type="text" 
                      id="roll-number" 
                      placeholder="CS-2024-042" 
                      required 
                      maxLength={15}
                      value={roll}
                      onChange={e => setRoll(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="grade-select">Grade / Dept</label>
                    <select id="grade-select" value={grade} onChange={e => setGrade(e.target.value)}>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Eng.">Mechanical Eng.</option>
                        <option value="Business Admin">Business Admin</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="photo-upload">Upload Photo</label>
                    <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload}/>
                </div>

                <button type="submit" className="submit-btn" id="submit-btn">Enroll Student</button>
            </form>
        </section>

        {/* Display Section (3D Card) */}
        <section className="display-section">
            <div 
              className="card-container" 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
                <div className="id-card" ref={cardRef}>
                    <div className="card-header">
                        <div className="logo"><Feather className="w-5 h-5" /> ACADEMIA</div>
                        <div className="chip"></div>
                    </div>

                    <div className="card-body">
                        <div className="photo-container">
                            {photo ? (
                              <img src={photo} alt="Student" />
                            ) : (
                              <User className="w-10 h-10 photo-placeholder" />
                            )}
                        </div>
                        <div className="details">
                            <div className="role">{grade || 'Computer Science'}</div>
                            <div className="name">{name || 'Student Name'}</div>
                            <div className="field">ID: <span>{roll || 'CS-0000'}</span></div>
                            <div className="field">Issued: <span>Mar 2026</span></div>
                        </div>
                    </div>

                    <div className="card-footer">
                        <div className="system-details">SECURE DIGITAL ID // NF-74</div>
                        <div className="barcode"></div>
                    </div>
                </div>
            </div>
        </section>
      </div>

      {/* Enrolled Students Section */}
      <section className="enrolled-section">
        <div className="relative w-full h-full min-h-[300px]">
          {!isAuthorized && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#040811]/40 backdrop-blur-xl rounded-[24px] border border-white/10 m-2">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-6 h-6 text-[#0088ff]" />
                <h3 className="text-xl font-bold text-white uppercase tracking-wider m-0">
                  Admin Access Required
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input 
                  type="password" 
                  placeholder="Enter Pin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#0088ff] text-center tracking-widest font-mono shadow-inner transition-colors"
                />
                <button 
                  onClick={handleUnlock} 
                  className="px-8 py-3 bg-gradient-to-r from-[#0088ff] to-[#00d2ff] rounded-xl text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,136,255,0.4)]"
                >
                  Unlock
                </button>
              </div>
            </div>
          )}

          <div className={`transition-all duration-700 ease-in-out w-full h-full ${!isAuthorized ? 'opacity-30 blur-lg pointer-events-none select-none' : ''}`}>
            <div className="glass-panel list-header flex justify-between items-center gap-4 flex-wrap">
                <h2 className="m-0 font-bold text-2xl">Enrolled Students</h2>
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="max-w-[300px] m-0 !px-4 !py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="list-grid">
                {students.length === 0 ? (
                  <div className="student-item">
                      <div className="item-photo"><User className="w-6 h-6 opacity-50" /></div>
                      <div className="item-info">
                          <div className="item-name">No students enrolled yet</div>
                          <div className="item-roll">Fill the form to begin</div>
                      </div>
                  </div>
                ) : students.filter(s => 
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    s.roll.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map(student => (
                  <div key={student.id} className="student-item">
                    <div className="item-photo">
                      {student.photo ? <img src={student.photo} alt={student.name} /> : <User className="w-6 h-6 opacity-50" />}
                    </div>
                    <div className="item-info">
                      <div className="item-name">{student.name}</div>
                      <div className="item-roll">{student.roll} - {student.grade}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
