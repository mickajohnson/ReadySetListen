export default () => {};

export const getServerSideProps = () => {
  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
    props: {},
  };
};
