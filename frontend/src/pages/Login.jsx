import Form from "../components/Form";

function Login({ user }) {
  return <Form route="/api/token/" method="login" />;
}

export default Login;
