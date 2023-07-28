import { usePocket } from "../../context/pocketBaseContext";

export default function EditProfile() {
  const { user, updateUser } = usePocket();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const [avatar] = e.target;
    
    const formData = new FormData()

    console.log(user!.id)
    formData.append('avatar', avatar.files[0])

    try {
      await updateUser!(user!.id, formData)
      avatar.value = ''
      console.log('done uploading')
    }catch(err:any){
      console.log(err.response ? err.response : err)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" name="avatar" />
        <button type="submit">upload</button>
      </form>
    </div>
  );
}
