import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { BASE_URL, requestBackend } from 'util/requests';
import { Link } from 'react-router-dom';
import { hasAnyRoles } from 'util/auth';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const getEmployees = (pageNumber: number) => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      baseURL: BASE_URL,
      params: {
        page: pageNumber,
        size: 4,
      },
      withCredentials: true
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  };

  useEffect(() => {
    getEmployees(0);
  }, []);

  const handlePageChange = (pageNumber: number) => {
    getEmployees(pageNumber);
  };

  return (
    <>
      <Link to="/admin/employees/create">
        { hasAnyRoles(['ROLE_ADMIN']) && (
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
        )}
      </Link>
        {page?.content.map((employee) => (
          <div key={employee.id}>
            <EmployeeCard employee={employee} />
          </div>
        ))}
      
      <Pagination
        forcePage={page?.number}
        pageCount={(page) ? page.totalPages : 0}
        range={ (page) ? page.size : 3 }
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
