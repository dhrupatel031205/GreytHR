// EmployeeContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // Make sure this path is correct

export interface Employee {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: "male" | "female" | "other";
  role: "admin" | "hr" | "employee";
  address: string;
  department: string;
  designation: string;
  doj: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: "active" | "inactive";
  avatar?: string;
  documents?: {
    idProof?: string;
    resume?: string;
  };
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  searchTerm: string;
  filterDepartment: string;
  filterRole: string;
}

type EmployeeAction =
  | { type: "SET_EMPLOYEES"; payload: Employee[] }
  | { type: "UPDATE_EMPLOYEE"; payload: Employee }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_FILTER_DEPARTMENT"; payload: string }
  | { type: "SET_FILTER_ROLE"; payload: string };

const initialState: EmployeeState = {
  employees: [],
  loading: true,
  searchTerm: "",
  filterDepartment: "",
  filterRole: "",
};

const EmployeeContext = createContext<{
  state: EmployeeState;
  updateEmployee: (employee: Employee) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setFilterDepartment: (department: string) => void;
  setFilterRole: (role: string) => void;
  getFilteredEmployees: () => Employee[];
} | null>(null);

const employeeReducer = (
  state: EmployeeState,
  action: EmployeeAction
): EmployeeState => {
  switch (action.type) {
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.map((emp) =>
          emp._id === action.payload._id ? action.payload : emp
        ),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_FILTER_DEPARTMENT":
      return { ...state, filterDepartment: action.payload };
    case "SET_FILTER_ROLE":
      return { ...state, filterRole: action.payload };
    default:
      return state;
  }
};

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);
  const { user } = useAuth(); // ✅ Getting logged-in user from AuthContext

  useEffect(() => {
    const fetchEmployeeByUserId = async () => {
      if (!user?._id) return;

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await axios.get(`/api/employee/user/${user._id}`);
        dispatch({ type: "SET_EMPLOYEES", payload: [res.data] });
      } catch (error) {
        console.error("Failed to fetch employee:", error);
        toast.error("Failed to fetch employee data");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    fetchEmployeeByUserId();
  }, [user]);

  const updateEmployee = async (employee: Employee) => {
    try {
      const res = await axios.put(`/api/employee/${employee._id}`, employee);
      dispatch({ type: "UPDATE_EMPLOYEE", payload: res.data });
      toast.success("Employee updated successfully!");
    } catch (error) {
      toast.error("Failed to update employee!");
      console.error("Update error:", error);
    }
  };

  const setSearchTerm = (term: string) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: term });
  };

  const setFilterDepartment = (department: string) => {
    dispatch({ type: "SET_FILTER_DEPARTMENT", payload: department });
  };

  const setFilterRole = (role: string) => {
    dispatch({ type: "SET_FILTER_ROLE", payload: role });
  };

  const getFilteredEmployees = (): Employee[] => {
    return state.employees.filter((employee) => {
      const matchesSearch =
        employee.fullName
          .toLowerCase()
          .includes(state.searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchesDepartment =
        !state.filterDepartment ||
        employee.department === state.filterDepartment;
      const matchesRole =
        !state.filterRole || employee.role === state.filterRole;

      return matchesSearch && matchesDepartment && matchesRole;
    });
  };

  return (
    <EmployeeContext.Provider
      value={{
        state,
        updateEmployee,
        setSearchTerm,
        setFilterDepartment,
        setFilterRole,
        getFilteredEmployees,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployee must be used within an EmployeeProvider");
  }
  return context;
};
