


export default function Home(props) {
  return (
    <div>
    <h1>Index</h1>
    <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps(){
  const response = await fetch('http://localhost:3001/episodes')
  const data = await response.json()

  return{ 
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, //vai alterar a api a cada 8 horas (pois tem apenas 1 podcasta por dia)
  }
}
