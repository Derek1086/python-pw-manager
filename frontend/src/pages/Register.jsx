import Form from "../components/Form";

function Register() {
  return <Form route="/api/user/register/" method="register" user={null} />;
}

export default Register;
