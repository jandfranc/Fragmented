import React from 'react';
import FragmentForm from '../components/FragmentForm';
import DeFragmentForm from '../components/DeFragmentForm';

const Home = () => {
  return (
    <div>
      <h1>NFT Fragmenter</h1>
      <FragmentForm />
      <DeFragmentForm />
    </div>
  );
};

export default Home;