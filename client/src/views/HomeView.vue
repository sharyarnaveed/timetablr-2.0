<template>
  <main class="mainhomesec">
    <nav>
      <h1><b>Timetablr</b></h1>
    </nav>

    <section class="contentsections">
      <div class="writtencontent">
        <div class="slogan">
          <h1>
            YOUR TIMETABLE <br />
            -> Simplified
          </h1>
        </div>
        <div class="buttons">
          <!-- ✅ Direct APK Download -->
          <a 
            class="signinlink" 
            href="/timetablr.apk" 
            download
          >
            Download APK
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.mainhomesec + * {
  visibility: hidden;
}

@media only screen and (max-width: 349px) {
  nav {
    max-height: 11%;
    min-height: 10%;
    display: flex;
    align-items: center;
    padding: 5px 10px;
  }
  nav h1 {
    font-family: var(--majorfont);
    font-size: 1.7rem;
    color: whitesmoke;
    font-weight: 300;
  }
  .mainhomesec {
    background-image: url("https://images.unsplash.com/photo-1701690774955-7d06cfd3f857?q=80&w=1563&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    background-size: cover;
    height: 100vh;
    overflow: hidden;
    padding: 10px 10px;
  }
  .contentsections {
    height: 90%;
  }
  .writtencontent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .slogan {
    min-height: 20%;
    display: flex;
    align-items: center;
    text-align: center;
  }
  .slogan h1 {
    font-family: var(--majorfont);
    font-size: 1.5rem;
    color: whitesmoke;
  }
  .buttons {
    height: 22%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .signinlink {
    width: 80%;
    height: 49%;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;
    font-family: var(--majorfont);
    border: 2px solid whitesmoke;
    border-radius: 5px;
  }
}

@media only screen and (min-width: 350px) {
  nav {
    max-height: 11%;
    min-height: 10%;
    display: flex;
    align-items: center;
    padding: 5px 10px;
  }
  nav h1 {
    font-family: var(--majorfont);
    font-size: 2rem;
    color: whitesmoke;
    font-weight: 300;
  }
  .mainhomesec {
    background-image: url("https://images.unsplash.com/photo-1701690774955-7d06cfd3f857?q=80&w=1563&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    background-position: center;
    background-size: cover;
    height: 100vh;
    padding: 10px 10px;
  }
  .contentsections {
    height: 90%;
    padding: 10px 2px;
  }
  .writtencontent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .slogan {
    min-height: 80%;
    display: flex;
    text-align: center;
    padding: 2% 5px;
    justify-content: center;
  }
  .slogan h1 {
    font-family: var(--majorfont);
    font-size: 2rem;
    text-align: center;
    color: whitesmoke;
  }
  .buttons {
    height: 22%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .signinlink {
    width: 60%;
    height: 49%;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;
    font-family: var(--majorfont);
    border: 2px solid whitesmoke;
    border-radius: 5px;
  }
}

@media only screen and (min-width: 576px) {
  nav {
    max-height: 11%;
    min-height: 10%;
    display: flex;
    align-items: center;
    padding: 5px 10px;
  }
  nav h1 {
    font-family: var(--majorfont);
    font-size: 2.2rem;
    color: whitesmoke;
    font-weight: 300;
  }
  .mainhomesec {
    background-image: url("https://images.unsplash.com/photo-1700173318258-3c0134576743?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    background-position: center;
    background-size: cover;
    height: 100vh;
    padding: 10px 10px;
  }
  .contentsections {
    height: 90%;
    padding: 10px 2px;
  }
  .writtencontent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
  .slogan {
    min-height: 80%;
    display: flex;
    align-items: center;
    padding: 2% 5px;
    justify-content: start;
  }
  .slogan h1 {
    font-family: var(--majorfont);
    font-size: 2.5rem;
    text-align: center;
    color: whitesmoke;
  }
  .buttons {
    height: 22%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .signinlink {
    width: 30%;
    height: 55%;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    font-size: 1.2rem;
    font-weight: 600;
    text-decoration: none;
    font-family: var(--majorfont);
    border: 2px solid whitesmoke;
    border-radius: 5px;
  }
}
</style>
