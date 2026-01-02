import { useQuery } from "@tanstack/react-query";

import { getUsers } from "../requests/users";

const Users = () => {
  return (
    <div>
      <h2>Users</h2>
      <UserTable />
    </div>
  );
};

const UserTable = () => {
  const result = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>user service not available due to server problems</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Blogs created</th>
        </tr>
      </thead>
      <tbody>
        {result.data.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Users;
