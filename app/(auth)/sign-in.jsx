import { Text, View, ScrollView, Alert} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { images } from '../../constants'
import { Image } from 'react-native'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getCurrentUser } from '../../lib/appwrite'


const SignIn = () => {
  const [form, setForm] = useState({
    email:'',
    password:''
  })
  const {setUser, setIsLogged} = useGlobalContext();

  const[isSubmitting, setIsSubmitting] = useState(false)
  async function submit(){
    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields');
    }
    setIsSubmitting(true)
    try{
      await signIn(form.email, form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace('/home'); 
    }catch(error){
      Alert.alert('Error', error.message)
    }finally{
      setIsSubmitting(false)
    }
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{height:'101%'}}>
        <View className='w-full justify-center min-h-full px-4 my-6'>
          <Image source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />
          <Text className='text-2xl text-white text-semibold
          mt-10 font-semibold'>Log in to Aora</Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e)=>setForm({...form, email : e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e)=>setForm({...form, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-regular'>Don't have an account?</Text>
            <Link className='text-lg font-psemibold text-secondary-100' href='/sign-up'>Sign up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn