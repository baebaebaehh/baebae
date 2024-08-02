import React, { useState, useMemo } from "react";
import { Plus, X, Edit2, Check, Trash2, Cake } from "lucide-react";

const OrgChart = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    project: "",
    mbti: "",
    birthMonth: "",
    birthDay: "",
    note: "",
  });
  const [filters, setFilters] = useState({
    roles: [],
    projects: [],
    mbti: "",
    birthMonth: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [roles, setRoles] = useState([
    "개발자",
    "디자이너",
    "매니저",
    "마케터",
  ]);
  const [projects, setProjects] = useState([
    "프로젝트 A",
    "프로젝트 B",
    "프로젝트 C",
  ]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const mbtiTypes = [
    "ISTJ",
    "ISFJ",
    "INFJ",
    "INTJ",
    "ISTP",
    "ISFP",
    "INFP",
    "INTP",
    "ESTP",
    "ESFP",
    "ENFP",
    "ENTP",
    "ESTJ",
    "ESFJ",
    "ENFJ",
    "ENTJ",
  ];
  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const addMember = () => {
    if (newMember.name && newMember.role && newMember.project) {
      setMembers([...members, { ...newMember, id: Date.now() }]);
      setNewMember({
        name: "",
        role: "",
        project: "",
        mbti: "",
        birthMonth: "",
        birthDay: "",
        note: "",
      });
      setShowAddForm(false);
    }
  };

  const removeMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const toggleFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  const setDropdownFilter = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const addCategory = (type) => {
    if (newCategory && !eval(type).includes(newCategory)) {
      if (type === "roles") {
        setRoles([...roles, newCategory]);
      } else {
        setProjects([...projects, newCategory]);
      }
      setNewCategory("");
      setEditingCategory(null);
    }
  };

  const removeCategory = (type, value) => {
    if (type === "roles") {
      setRoles(roles.filter((role) => role !== value));
      setFilters((prev) => ({
        ...prev,
        roles: prev.roles.filter((role) => role !== value),
      }));
    } else {
      setProjects(projects.filter((project) => project !== value));
      setFilters((prev) => ({
        ...prev,
        projects: prev.projects.filter((project) => project !== value),
      }));
    }
  };

  const editCategory = (type, oldValue, newValue) => {
    if (type === "roles") {
      setRoles(roles.map((role) => (role === oldValue ? newValue : role)));
      setFilters((prev) => ({
        ...prev,
        roles: prev.roles.map((role) => (role === oldValue ? newValue : role)),
      }));
    } else {
      setProjects(
        projects.map((project) => (project === oldValue ? newValue : project))
      );
      setFilters((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project === oldValue ? newValue : project
        ),
      }));
    }
    setEditingItem(null);
  };

  const isHighlighted = (member) =>
    (filters.roles.length === 0 || filters.roles.includes(member.role)) &&
    (filters.projects.length === 0 ||
      filters.projects.includes(member.project)) &&
    (filters.mbti === "" || filters.mbti === member.mbti) &&
    (filters.birthMonth === "" || filters.birthMonth === member.birthMonth);

  const isBirthdayThisWeek = (birthMonth, birthDay) => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear(),
      parseInt(birthMonth) - 1,
      parseInt(birthDay)
    );
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return birthDate >= today && birthDate <= nextWeek;
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const aHighlighted = isHighlighted(a);
      const bHighlighted = isHighlighted(b);
      if (aHighlighted && !bHighlighted) return -1;
      if (!aHighlighted && bHighlighted) return 1;
      return 0;
    });
  }, [members, filters]);

  const editMember = (member) => {
    setEditingMember(member);
  };

  const saveMemberEdit = () => {
    setMembers(
      members.map((m) => (m.id === editingMember.id ? editingMember : m))
    );
    setEditingMember(null);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 relative">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">조직도</h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
        >
          <Plus size={20} />
        </button>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">새 구성원 추가</h2>
              <input
                type="text"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
                placeholder="이름"
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              />
              <select
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              >
                <option value="">공종 선택</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={newMember.project}
                onChange={(e) =>
                  setNewMember({ ...newMember, project: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              >
                <option value="">프로젝트 선택</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <select
                value={newMember.mbti}
                onChange={(e) =>
                  setNewMember({ ...newMember, mbti: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              >
                <option value="">MBTI 선택</option>
                {mbtiTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="flex mb-2">
                <select
                  value={newMember.birthMonth}
                  onChange={(e) =>
                    setNewMember({ ...newMember, birthMonth: e.target.value })
                  }
                  className="border border-gray-300 p-2 rounded-md w-1/2 mr-2"
                >
                  <option value="">생일 월 선택</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newMember.birthDay}
                  onChange={(e) =>
                    setNewMember({ ...newMember, birthDay: e.target.value })
                  }
                  placeholder="생일 (일)"
                  className="border border-gray-300 p-2 rounded-md w-1/2"
                />
              </div>
              <textarea
                value={newMember.note}
                onChange={(e) =>
                  setNewMember({ ...newMember, note: e.target.value })
                }
                placeholder="노트"
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                rows="3"
              />
              <div className="flex justify-end">
                <button
                  onClick={addMember}
                  className="bg-blue-500 text-white p-2 rounded-md mr-2"
                >
                  추가
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white p-2 rounded-md"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">필터</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-medium text-gray-700 mr-2">공종</h3>
                <button
                  onClick={() => setEditingCategory("roles")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="flex flex-wrap items-center">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleFilter("roles", role)}
                    className={`mr-2 mb-2 px-3 py-1 text-sm rounded-full ${
                      filters.roles.includes(role)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800"
                    } hover:bg-blue-600 hover:text-white transition duration-300`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-medium text-gray-700 mr-2">
                  프로젝트
                </h3>
                <button
                  onClick={() => setEditingCategory("projects")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              <div className="flex flex-wrap items-center">
                {projects.map((project) => (
                  <button
                    key={project}
                    onClick={() => toggleFilter("projects", project)}
                    className={`mr-2 mb-2 px-3 py-1 text-sm rounded-full ${
                      filters.projects.includes(project)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800"
                    } hover:bg-blue-600 hover:text-white transition duration-300`}
                  >
                    {project}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">MBTI</h3>
              <select
                value={filters.mbti}
                onChange={(e) => setDropdownFilter("mbti", e.target.value)}
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="">전체</option>
                {mbtiTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">생일</h3>
              <select
                value={filters.birthMonth}
                onChange={(e) =>
                  setDropdownFilter("birthMonth", e.target.value)
                }
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="">전체</option>
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {editingCategory && (
          <div className="mb-8 p-6 bg-white bg-opacity-50 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory === "roles" ? "공종 편집" : "프로젝트 편집"}
            </h3>
            <div className="space-y-2">
              {(editingCategory === "roles" ? roles : projects).map(
                (item, index) => (
                  <div key={index} className="flex items-center">
                    {editingItem === item ? (
                      <>
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="border border-gray-300 p-1 rounded-md mr-2 text-sm"
                        />
                        <button
                          onClick={() =>
                            editCategory(editingCategory, item, newCategory)
                          }
                          className="text-green-500 hover:text-green-700 mr-2"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">{item}</span>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setNewCategory(item);
                          }}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => removeCategory(editingCategory, item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder={`새 ${
                  editingCategory === "roles" ? "공종" : "프로젝트"
                }`}
                className="border border-gray-300 p-1 rounded-md mr-2 text-sm"
              />
              <button
                onClick={() => addCategory(editingCategory)}
                className="bg-green-500 text-white p-1 rounded-full mr-2"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => setEditingCategory(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              완료
            </button>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">팀 멤버</h2>
          <button
            onClick={() => setEditingMember("all")}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedMembers.map((member) => (
            <div
              key={member.id}
              className={`relative p-4 rounded-xl shadow-md transition-all duration-500 ease-in-out transform ${
                isHighlighted(member)
                  ? "bg-white bg-opacity-75 scale-105"
                  : "bg-white bg-opacity-30 filter grayscale"
              }`}
            >
              {isBirthdayThisWeek(member.birthMonth, member.birthDay) && (
                <div className="absolute top-2 right-2 text-yellow-500">
                  <Cake size={20} />
                </div>
              )}
              {editingMember === "all" ? (
                <button
                  onClick={() => editMember(member)}
                  className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={16} />
                </button>
              ) : (
                <button
                  onClick={() => removeMember(member.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
              <h2 className="text-lg font-bold mb-1 text-gray-800">
                {member.name}
              </h2>
              <p className="text-sm text-gray-600">공종: {member.role}</p>
              <p className="text-sm text-gray-600">
                프로젝트: {member.project}
              </p>
              <p className="text-sm text-gray-600">MBTI: {member.mbti}</p>
              <p className="text-sm text-gray-600">
                생일: {member.birthMonth}월 {member.birthDay}일
              </p>
              {member.note && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  "{member.note}"
                </p>
              )}
            </div>
          ))}
        </div>

        {editingMember && editingMember !== "all" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">구성원 정보 수정</h2>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, name: e.target.value })
                }
                placeholder="이름"
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              />
              <select
                value={editingMember.role}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, role: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              >
                <option value="">공종 선택</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={editingMember.project}
                onChange={(e) =>
                  setEditingMember({
                    ...editingMember,
                    project: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              >
                <option value="">프로젝트 선택</option>
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <select
                value={editingMember.mbti}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, mbti: e.target.value })
                }
                className="border border-gray-300 p-2 rounded-md w-full mb-2"
              >
                <option value="">MBTI 선택</option>
                {mbtiTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="flex mb-2">
                <select
                  value={editingMember.birthMonth}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      birthMonth: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-md w-1/2 mr-2"
                >
                  <option value="">생일 월 선택</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={editingMember.birthDay}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      birthDay: e.target.value,
                    })
                  }
                  placeholder="생일 (일)"
                  className="border border-gray-300 p-2 rounded-md w-1/2"
                />
              </div>
              <textarea
                value={editingMember.note}
                onChange={(e) =>
                  setEditingMember({ ...editingMember, note: e.target.value })
                }
                placeholder="노트"
                className="border border-gray-300 p-2 rounded-md w-full mb-4"
                rows="3"
              />
              <div className="flex justify-end">
                <button
                  onClick={saveMemberEdit}
                  className="bg-blue-500 text-white p-2 rounded-md mr-2"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingMember(null)}
                  className="bg-gray-500 text-white p-2 rounded-md"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgChart;
