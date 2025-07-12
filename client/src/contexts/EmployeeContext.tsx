import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from 'react-toastify';

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'hr' | 'employee';
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
  status: 'active' | 'inactive';
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
  | { type: 'SET_EMPLOYEES'; payload: Employee[] }
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'DELETE_EMPLOYEE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER_DEPARTMENT'; payload: string }
  | { type: 'SET_FILTER_ROLE'; payload: string };

const initialState: EmployeeState = {
  employees: [
    {
      id: '1',
      fullName: 'Admin User',
      email: 'admin@greyhr.com',
      phone: '+1-234-567-8901',
      dob: '1985-05-15',
      gender: 'male',
      role: 'admin',
      address: '123 Admin Street, City',
      department: 'Administration',
      designation: 'System Administrator',
      doj: '2020-01-01',
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'BANK0001234',
        bankName: 'Sample Bank',
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Spouse',
        phone: '+1-234-567-8902',
      },
      status: 'active',
    },
    {
      id: '2',
      fullName: 'HR Manager',
      email: 'hr@greyhr.com',
      phone: '+1-234-567-8903',
      dob: '1988-08-22',
      gender: 'female',
      role: 'hr',
      address: '456 HR Avenue, City',
      department: 'Human Resources',
      designation: 'HR Manager',
      doj: '2020-03-15',
      bankDetails: {
        accountNumber: '2234567890',
        ifscCode: 'BANK0001235',
        bankName: 'Sample Bank',
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Parent',
        phone: '+1-234-567-8904',
      },
      status: 'active',
    },
    {
      id: '3',
      fullName: 'John Doe',
      email: 'employee@greyhr.com',
      phone: '+1-234-567-8905',
      dob: '1992-12-10',
      gender: 'male',
      role: 'employee',
      address: '789 Employee Road, City',
      department: 'Engineering',
      designation: 'Software Developer',
      doj: '2021-06-01',
      bankDetails: {
        accountNumber: '3234567890',
        ifscCode: 'BANK0001236',
        bankName: 'Sample Bank',
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Sibling',
        phone: '+1-234-567-8906',
      },
      status: 'active',
    },
  ],
  loading: false,
  searchTerm: '',
  filterDepartment: '',
  filterRole: '',
};

const EmployeeContext = createContext<{
  state: EmployeeState;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setFilterDepartment: (department: string) => void;
  setFilterRole: (role: string) => void;
  getFilteredEmployees: () => Employee[];
} | null>(null);

const employeeReducer = (state: EmployeeState, action: EmployeeAction): EmployeeState => {
  switch (action.type) {
    case 'SET_EMPLOYEES':
      return { ...state, employees: action.payload };
    case 'ADD_EMPLOYEE':
      return { ...state, employees: [...state.employees, action.payload] };
    case 'UPDATE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
    case 'DELETE_EMPLOYEE':
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_FILTER_DEPARTMENT':
      return { ...state, filterDepartment: action.payload };
    case 'SET_FILTER_ROLE':
      return { ...state, filterRole: action.payload };
    default:
      return state;
  }
};

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
    toast.success('Employee added successfully!');
  };

  const updateEmployee = (employee: Employee) => {
    dispatch({ type: 'UPDATE_EMPLOYEE', payload: employee });
    toast.success('Employee updated successfully!');
  };

  const deleteEmployee = (id: string) => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
    toast.success('Employee deleted successfully!');
  };

  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const setFilterDepartment = (department: string) => {
    dispatch({ type: 'SET_FILTER_DEPARTMENT', payload: department });
  };

  const setFilterRole = (role: string) => {
    dispatch({ type: 'SET_FILTER_ROLE', payload: role });
  };

  const getFilteredEmployees = (): Employee[] => {
    return state.employees.filter(employee => {
      const matchesSearch = employee.fullName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(state.searchTerm.toLowerCase());
      const matchesDepartment = !state.filterDepartment || employee.department === state.filterDepartment;
      const matchesRole = !state.filterRole || employee.role === state.filterRole;
      
      return matchesSearch && matchesDepartment && matchesRole;
    });
  };

  return (
    <EmployeeContext.Provider value={{
      state,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      setSearchTerm,
      setFilterDepartment,
      setFilterRole,
      getFilteredEmployees,
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};