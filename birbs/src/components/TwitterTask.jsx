import React from 'react';
import '../App.css';

const TwitterTask = ({verifyTwitter, followed, sourceUser, setSourceUser, handleSignIn}) => {

  return (
    <div>
      <p>Up next is the Twitter Task</p>
      <p>Follow the twitter profile, like and retweet the post <a target="_blank" href="https://twitter.com/skaterbirdsNFT">Skaterbirds</a> </p>
      {/* <button onClick={handleSignIn}>Sign into twitter</button> */}
      <form className="Discord-form" onSubmit={verifyTwitter} >
        <input
          type="text"
          placeholder="Input your twitter User"
          value={sourceUser}
          onChange={(e)=>setSourceUser(e.target.value)}
          required
        />
        <button type="submit" >Check</button>
      
      </form>

    </div>
  )

};


export default TwitterTask
