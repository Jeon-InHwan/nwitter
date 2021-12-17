import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import {authService} from "myFirebase";


function App() {

  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  // setUserObj하는 객체가 너무 커서 기존의 객체와 달라졌는지 react가 구분하기 힘들어함
  // 따라서 react가 rerender하도록 1. Obj의 크기를 줄이거나 2. assign을 통해 유도한다
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    });
  }

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initialazing..."}
    </>
  );
}

export default App;
