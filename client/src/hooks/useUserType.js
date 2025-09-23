import { useEffect, useState } from 'react';

export default function useUserType() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || '';
    fetch(`${apiUrl}/user-info`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user info');
        return res.json();
      })
      .then(data => {
        setUserType(data.userType);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return userType;
}
